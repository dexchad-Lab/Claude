import Link from "next/link";
import { signOutAction } from "@/lib/actions";

export function NavBar({
  userLabel,
  pendingRequestsCount = 0,
}: {
  userLabel: string;
  pendingRequestsCount?: number;
}) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="text-sm font-semibold text-gray-900">
          Job Application Tracker
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/network"
            className="relative text-sm text-gray-500 hover:text-primary"
          >
            Network
            {pendingRequestsCount > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white">
                {pendingRequestsCount}
              </span>
            )}
          </Link>
          <Link
            href="/settings"
            className="text-sm text-gray-500 hover:text-primary"
          >
            {userLabel}
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
