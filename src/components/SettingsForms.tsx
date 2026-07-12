"use client";

import { useActionState } from "react";
import {
  updateProfileAction,
  changePasswordAction,
  type ProfileState,
  type PasswordState,
} from "@/app/(app)/settings/actions";

const initialProfileState: ProfileState = {};
const initialPasswordState: PasswordState = {};

export function SettingsForms({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [profileState, profileFormAction, profilePending] = useActionState(
    updateProfileAction,
    initialProfileState,
  );
  const [passwordState, passwordFormAction, passwordPending] = useActionState(
    changePasswordAction,
    initialPasswordState,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Profile</h2>
        <form action={profileFormAction} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={initialName}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={initialEmail}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          {profileState.error && (
            <p className="text-sm text-red-600 dark:text-red-400">{profileState.error}</p>
          )}
          {profileState.success && (
            <p className="text-sm text-green-600 dark:text-green-400">{profileState.success}</p>
          )}
          <button
            type="submit"
            disabled={profilePending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {profilePending ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Change password
        </h2>
        <form action={passwordFormAction} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          {passwordState.error && (
            <p className="text-sm text-red-600 dark:text-red-400">{passwordState.error}</p>
          )}
          {passwordState.success && (
            <p className="text-sm text-green-600 dark:text-green-400">{passwordState.success}</p>
          )}
          <button
            type="submit"
            disabled={passwordPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {passwordPending ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
