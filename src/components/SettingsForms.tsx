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
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Profile</h2>
        <form action={profileFormAction} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={initialName}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={initialEmail}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          {profileState.error && (
            <p className="text-sm text-red-600">{profileState.error}</p>
          )}
          {profileState.success && (
            <p className="text-sm text-green-600">{profileState.success}</p>
          )}
          <button
            type="submit"
            disabled={profilePending}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {profilePending ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">
          Change password
        </h2>
        <form action={passwordFormAction} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </div>
          {passwordState.error && (
            <p className="text-sm text-red-600">{passwordState.error}</p>
          )}
          {passwordState.success && (
            <p className="text-sm text-green-600">{passwordState.success}</p>
          )}
          <button
            type="submit"
            disabled={passwordPending}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {passwordPending ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
