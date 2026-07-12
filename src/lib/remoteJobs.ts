const FETCH_TIMEOUT_MS = 8000;

export type RemoteJob = {
  id: string;
  position: string;
  company: string;
  tags: string[];
  url: string;
  date: string | null;
  logo: string | null;
};

type RemoteOkEntry = {
  id?: string | number;
  position?: string;
  company?: string;
  tags?: string[];
  url?: string;
  apply_url?: string;
  date?: string;
  company_logo?: string;
};

/**
 * Pulls listings from remoteok.com's public JSON API (intended for reuse —
 * no auth, no scraping involved). Returns an empty array on any failure
 * (timeout, network block, unexpected shape) rather than throwing, so a
 * flaky or unreachable upstream never breaks the page — the caller shows
 * an explanatory empty state instead.
 */
export async function fetchRemoteJobs(): Promise<RemoteJob[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch("https://remoteok.com/api", {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HuntlyBot/1.0)",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter(
        (entry): entry is RemoteOkEntry =>
          !!entry &&
          typeof entry === "object" &&
          "position" in entry &&
          "company" in entry,
      )
      .map((entry) => ({
        id: String(entry.id ?? entry.url ?? Math.random()),
        position: entry.position ?? "Untitled role",
        company: entry.company ?? "Unknown company",
        tags: Array.isArray(entry.tags) ? entry.tags.slice(0, 6) : [],
        url: entry.url ?? entry.apply_url ?? "https://remoteok.com",
        date: entry.date ?? null,
        logo: entry.company_logo ?? null,
      }))
      .slice(0, 100);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
