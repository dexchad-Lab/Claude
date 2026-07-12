"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getPusherClient } from "@/lib/pusherClient";
import { chatChannelName } from "@/lib/pusherServer";
import { usePresence } from "@/components/PresenceProvider";
import { sendMessageAction } from "@/app/(app)/chat/[userId]/actions";

export type ChatMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
};

export function ChatThread({
  currentUserId,
  otherUserId,
  otherUserName,
  initialMessages,
}: {
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, startSending] = useTransition();
  const onlineUserIds = usePresence();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;

    const channelName = chatChannelName(currentUserId, otherUserId);
    const channel = pusher.subscribe(channelName);

    channel.bind("new-message", (message: ChatMessage) => {
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSend() {
    const trimmed = content.trim();
    if (!trimmed) return;
    setError(null);
    startSending(async () => {
      const result = await sendMessageAction(otherUserId, trimmed);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.message) {
        setMessages((prev) =>
          prev.some((m) => m.id === result.message!.id)
            ? prev
            : [...prev, result.message!],
        );
      }
      setContent("");
    });
  }

  const isOnline = onlineUserIds.has(otherUserId);

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <span
          className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-300"}`}
        />
        <h1 className="text-sm font-semibold text-gray-900">{otherUserName}</h1>
        <span className="text-xs text-gray-400">
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400">
            No messages yet — say hello.
          </p>
        )}
        {messages.map((message) => {
          const isMine = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  isMine
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`mt-1 text-[10px] ${isMine ? "text-gray-300" : "text-gray-400"}`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-100 p-3">
        {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
        <div className="flex items-end gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !content.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
