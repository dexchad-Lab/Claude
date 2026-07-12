"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { usePresence } from "@/components/PresenceProvider";
import {
  sendConnectionRequestAction,
  respondToConnectionRequestAction,
  type ConnectionActionState,
} from "@/app/(app)/network/actions";

export type ConnectionPerson = {
  connectionId: string;
  userId: string;
  name: string;
  email: string;
  unreadCount?: number;
};

const initialState: ConnectionActionState = {};

export function NetworkClient({
  pendingReceived,
  pendingSent,
  connections,
}: {
  pendingReceived: ConnectionPerson[];
  pendingSent: ConnectionPerson[];
  connections: ConnectionPerson[];
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    sendConnectionRequestAction,
    initialState,
  );
  const onlineUserIds = usePresence();
  const [, startTransition] = useTransition();

  function respond(connectionId: string, accept: boolean) {
    startTransition(async () => {
      await respondToConnectionRequestAction(connectionId, accept);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          Add a connection
        </h2>
        <form action={formAction} className="flex flex-wrap items-center gap-2">
          <input
            type="email"
            name="email"
            placeholder="Their account email"
            required
            className="w-64 max-w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {pending ? "Sending..." : "Send request"}
          </button>
        </form>
        {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
        {state.success && (
          <p className="mt-2 text-sm text-green-600">{state.success}</p>
        )}
      </div>

      {pendingReceived.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Requests
          </h2>
          <ul className="space-y-3">
            {pendingReceived.map((person) => (
              <li
                key={person.connectionId}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => respond(person.connectionId, true)}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => respond(person.connectionId, false)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          Your connections
        </h2>
        {connections.length === 0 ? (
          <p className="text-sm text-gray-400">
            No connections yet — add someone above.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {connections.map((person) => {
              const isOnline = onlineUserIds.has(person.userId);
              return (
                <li
                  key={person.connectionId}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-300"}`}
                      title={isOnline ? "Online" : "Offline"}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {person.name}
                      </p>
                      <p className="text-xs text-gray-500">{person.email}</p>
                    </div>
                  </div>
                  <Link
                    href={`/chat/${person.userId}`}
                    className="relative rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Message
                    {!!person.unreadCount && (
                      <span className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-medium leading-none text-white">
                        {person.unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {pendingSent.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Sent requests (awaiting response)
          </h2>
          <ul className="space-y-2">
            {pendingSent.map((person) => (
              <li key={person.connectionId} className="text-sm text-gray-600">
                {person.name} <span className="text-gray-400">({person.email})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
