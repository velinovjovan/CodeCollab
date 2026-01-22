"use client";
import Message from "@/components/Message";
import SelfMessage from "@/components/SelfMessage";
import { TeamChatProps } from "@/interfaces";

export default function TeamChat({
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
  loading,
  userId,
  messagesContainerRef,
}: TeamChatProps) {
  return (
    <div className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[700px]">
      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-slate-700 p-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h2 className="text-lg font-bold text-white">Team Chat</h2>
        </div>
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto space-y-3"
        ref={messagesContainerRef}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((message: any) =>
              message.send_by === userId ? (
                <SelfMessage
                  text={message.text}
                  user={{ id: userId } as any}
                  key={message.id}
                />
              ) : (
                <Message
                  user_id={message.send_by}
                  text={message.text}
                  key={message.id}
                />
              ),
            )}
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            disabled={loading || !messageInput.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
