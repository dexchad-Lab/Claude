import dns from "dns/promises";
import net from "net";

const MAX_RESPONSE_BYTES = 3 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15000;

function isPrivateOrReservedIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
    if (lower.startsWith("fe80")) return true;
    return false;
  }
  return true;
}

// Blocks the obvious SSRF cases (literal private/loopback IPs and hostnames
// that resolve to them). This is a pre-fetch DNS check, not IP-pinned at the
// socket level, so it doesn't fully close a DNS-rebinding race — an
// acceptable trade-off for this app's scale, not a substitute for network-
// level egress controls in a higher-stakes deployment.
async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Enter a valid URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http:// and https:// URLs are supported");
  }
  if (url.hostname === "localhost") {
    throw new Error("That URL isn't allowed");
  }

  const addresses = await dns.lookup(url.hostname, { all: true }).catch(() => []);
  if (addresses.length === 0) {
    throw new Error("Couldn't resolve that URL");
  }
  if (addresses.some((a) => isPrivateOrReservedIp(a.address))) {
    throw new Error("That URL isn't allowed");
  }

  return url;
}

export type ParsedJobPosting = {
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJobPosting(html: string): ParsedJobPosting | null {
  const scriptRegex =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = scriptRegex.exec(html))) {
    let json: unknown;
    try {
      json = JSON.parse(match[1].trim());
    } catch {
      continue;
    }

    const candidates: unknown[] = Array.isArray(json)
      ? json
      : Array.isArray((json as { "@graph"?: unknown[] })?.["@graph"])
        ? (json as { "@graph": unknown[] })["@graph"]
        : [json];

    for (const node of candidates) {
      const record = node as Record<string, unknown>;
      const type = record?.["@type"];
      const isJobPosting =
        type === "JobPosting" ||
        (Array.isArray(type) && type.includes("JobPosting"));
      if (!isJobPosting) continue;

      const hiringOrg = record.hiringOrganization as
        | Record<string, unknown>
        | undefined;
      const companyName =
        typeof hiringOrg?.name === "string" ? hiringOrg.name : undefined;
      const jobTitle =
        typeof record.title === "string" ? record.title : undefined;
      const jobDescription =
        typeof record.description === "string"
          ? stripHtml(record.description).slice(0, 20000)
          : undefined;

      return { companyName, jobTitle, jobDescription };
    }
  }

  return null;
}

export async function fetchJobPostingFromUrl(
  rawUrl: string,
): Promise<ParsedJobPosting> {
  const url = await assertPublicUrl(rawUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobApplicationTrackerBot/1.0)",
      },
    });
  } catch {
    throw new Error("Couldn't reach that URL");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`That page returned an error (${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Couldn't read that page");

  let received = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_RESPONSE_BYTES) {
      throw new Error("That page is too large to parse");
    }
    chunks.push(value);
  }
  const html = Buffer.concat(chunks).toString("utf-8");

  return extractJobPosting(html) ?? {};
}
