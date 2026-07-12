import Link from "next/link";
import { signOutAction } from "@/lib/actions";

function NetworkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function NavBar({
  userLabel,
  pendingRequestsCount = 0,
  unreadMessagesCount = 0,
}: {
  userLabel: string;
  pendingRequestsCount?: number;
  unreadMessagesCount?: number;
}) {
  const networkBadgeCount = pendingRequestsCount + unreadMessagesCount;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link
          href="/dashboard"
          className="min-w-0 truncate text-sm font-semibold text-gray-900"
        >
          Job Application Tracker
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <Link
            href="/network"
            aria-label={`Network${networkBadgeCount > 0 ? ` (${networkBadgeCount} new)` : ""}`}
            className="relative flex items-center gap-1.5 rounded-md p-2 text-gray-500 hover:text-primary sm:p-0"
          >
            <span className="sm:hidden">
              <NetworkIcon />
            </span>
            <span className="hidden text-sm sm:inline">Network</span>
            {networkBadgeCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-medium leading-none text-white sm:static sm:ml-1 sm:text-xs">
                {networkBadgeCount}
              </span>
            )}
          </Link>
          <Link
            href="/settings"
            aria-label={`Settings for ${userLabel}`}
            className="flex items-center rounded-md p-2 text-gray-500 hover:text-primary sm:p-0"
          >
            <span className="sm:hidden">
              <SettingsIcon />
            </span>
            <span className="hidden max-w-[10rem] truncate text-sm sm:inline">
              {userLabel}
            </span>
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              aria-label="Log out"
              className="flex items-center gap-1.5 rounded-md border border-gray-300 p-2 text-sm text-gray-700 hover:bg-gray-50 sm:px-3 sm:py-1.5"
            >
              <span className="sm:hidden">
                <LogoutIcon />
              </span>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
