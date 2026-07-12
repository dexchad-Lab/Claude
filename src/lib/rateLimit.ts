import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const RETENTION_HOURS = 24;

export async function isLoginLockedOut(email: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const recentFailures = await prisma.loginAttempt.count({
    where: { email, succeeded: false, createdAt: { gte: windowStart } },
  });
  return recentFailures >= MAX_ATTEMPTS;
}

export async function recordLoginAttempt(email: string, succeeded: boolean) {
  await prisma.loginAttempt.create({ data: { email, succeeded } });

  // Opportunistic cleanup (~5% of attempts) so this table doesn't grow
  // unbounded, without needing a separate cron job or a DB write on every login.
  if (Math.random() < 0.05) {
    const cutoff = new Date(Date.now() - RETENTION_HOURS * 60 * 60 * 1000);
    await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: cutoff } } });
  }
}
