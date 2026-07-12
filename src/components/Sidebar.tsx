"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboardIcon,
  ListIcon,
  TemplateIcon,
  GlobeIcon,
  CompassIcon,
  UserIcon,
  ChatBubbleIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { signOutAction } from "@/lib/actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboardIcon },
  { href: "/applications", label: "Applications", Icon: ListIcon },
  { href: "/cv-templates", label: "CV Templates", Icon: TemplateIcon },
  { href: "/remote-jobs", label: "Remote Jobs", Icon: GlobeIcon },
  { href: "/guide", label: "Remote Guide", Icon: CompassIcon },
];

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-base font-extrabold text-white shadow-sm">
        H
      </span>
      <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
        Huntly
      </span>
    </Link>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  messagesBadgeCount,
  onNavigate,
}: {
  messagesBadgeCount: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
      active
        ? "bg-primary/10 text-primary"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    }`;

  return (
    <nav className="flex-1 space-y-1 px-2">
      {NAV_ITEMS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={linkClass(isActive(pathname, href))}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
      <Link
        href="/network"
        onClick={onNavigate}
        className={linkClass(
          isActive(pathname, "/network") || isActive(pathname, "/chat"),
        )}
      >
        <span className="relative">
          <ChatBubbleIcon className="h-4 w-4" />
          {messagesBadgeCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-900">
              {messagesBadgeCount > 9 ? "9+" : messagesBadgeCount}
            </span>
          )}
        </span>
        Messages
      </Link>
      <Link
        href="/settings"
        onClick={onNavigate}
        className={linkClass(isActive(pathname, "/settings"))}
      >
        <UserIcon className="h-4 w-4" />
        Profile
      </Link>
    </nav>
  );
}

export function Sidebar({
  userLabel,
  messagesBadgeCount,
}: {
  userLabel: string;
  messagesBadgeCount: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden dark:border-gray-800 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/network"
            aria-label={`Messages${messagesBadgeCount > 0 ? ` (${messagesBadgeCount} new)` : ""}`}
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ChatBubbleIcon className="h-5 w-5" />
            {messagesBadgeCount > 0 && (
              <span className="absolute right-1 top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
            )}
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white p-4 shadow-xl dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <NavLinks
              messagesBadgeCount={messagesBadgeCount}
              onNavigate={() => setMobileOpen(false)}
            />
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
              <p className="truncate px-3 text-xs text-gray-500 dark:text-gray-400">
                {userLabel}
              </p>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:border-r md:border-gray-200 md:bg-white dark:md:border-gray-800 dark:md:bg-gray-900">
        <div className="flex h-16 shrink-0 items-center border-b border-gray-100 px-4 dark:border-gray-800">
          <Logo />
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
          <NavLinks messagesBadgeCount={messagesBadgeCount} />
          <div className="mt-4 space-y-2 border-t border-gray-100 px-2 pt-4 dark:border-gray-800">
            <div className="flex items-center justify-between gap-2 px-1">
              <p className="min-w-0 truncate text-xs text-gray-500 dark:text-gray-400">
                {userLabel}
              </p>
              <ThemeToggle />
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
