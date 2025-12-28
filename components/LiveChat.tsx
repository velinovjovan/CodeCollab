"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";
import Message from "@/components/Message";
import { User } from "@supabase/supabase-js";
import SelfMessage from "./SelfMessage";

// Define the types for message data
interface Message {
  id: string;
  text: string;
  created_at: string;
  send_by: string;
}

const supabase = createClient();

const LiveChat = ({ user }: { user: User }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    const getMessagesRefresh = async () => {
      const { error, data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error) {
        setMessages(data);
      }
    };

    getMessagesRefresh();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            payload.new as Message,
          ]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from("messages")
      .insert({ text: newMessage });

    setLoading(false);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setNewMessage("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <p className="text-sm font-semibold text-white uppercase tracking-wider">
            Live Community Chat
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-1">{messages.length} messages</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message: any) =>
              message.send_by == user.id ? (
                <SelfMessage text={message.text} user={user} key={message.id} />
              ) : (
                <Message
                  user_id={message.send_by}
                  text={message.text}
                  key={message.id}
                />
              )
            )}
            <div ref={endOfMessagesRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-900/50 p-4 backdrop-blur">
        <form className="flex items-center gap-3" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-all"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveChat;
