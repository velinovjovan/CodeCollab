"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Whiteboard from "./Whiteboard";

interface CommunityViewProps {
  communityId: string;
  userId: string;
}

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_email?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
}

const CommunityView = ({ communityId, userId }: CommunityViewProps) => {
  const [community, setCommunity] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [showCreateNote, setShowCreateNote] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadCommunity();
    loadMessages();
    loadNotes();

    // Subscribe to real-time updates
    const messagesChannel = supabase
      .channel(`community-messages-${communityId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_messages",
          filter: `community_id=eq.${communityId}`,
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    const notesChannel = supabase
      .channel(`community-notes-${communityId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_notes",
          filter: `community_id=eq.${communityId}`,
        },
        () => {
          loadNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(notesChannel);
    };
  }, [communityId]);

  const loadCommunity = async () => {
    const { data } = await supabase
      .from("communities")
      .select("*")
      .eq("id", communityId)
      .single();
    setCommunity(data);
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from("community_messages")
      .select(
        `
        *,
        profiles:user_id(email)
      `
      )
      .eq("community_id", communityId)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(
        data.map((msg: any) => ({
          ...msg,
          user_email: msg.profiles?.email || "Unknown",
        }))
      );
    }
  };

  const loadNotes = async () => {
    const { data } = await supabase
      .from("community_notes")
      .select("*")
      .eq("community_id", communityId)
      .order("created_at", { ascending: false });

    if (data) setNotes(data);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    await supabase.from("community_messages").insert({
      community_id: communityId,
      user_id: userId,
      content: messageInput,
    });

    setMessageInput("");
  };

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    await supabase.from("community_notes").insert({
      community_id: communityId,
      title: noteTitle,
      content: noteContent,
      created_by: userId,
    });

    setNoteTitle("");
    setNoteContent("");
    setShowCreateNote(false);
  };

  const deleteNote = async (noteId: string) => {
    await supabase.from("community_notes").delete().eq("id", noteId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/global")}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all"
          >
            <svg
              className="w-6 h-6 text-gray-400 hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{community?.name}</h1>
            <p className="text-gray-400 mt-1">{community?.description}</p>
          </div>
        </div>
      </div>

      {/* Whiteboard - Full Width */}
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden"
        style={{ height: "calc(100vh - 250px)", minHeight: "700px" }}
      >
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-slate-700 p-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <h2 className="text-lg font-bold text-white">
              Collaborative Whiteboard
            </h2>
          </div>
        </div>
        <Whiteboard communityId={communityId} userId={userId} />
      </div>

      {/* Two Column Layout - Chat & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Section */}
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

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.user_id === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3 shadow-lg ${
                      msg.user_id === userId
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                        : "bg-slate-700/80 text-gray-100"
                    }`}
                  >
                    <p className="text-xs opacity-75 mb-1 font-medium">
                      {msg.user_email}
                    </p>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))
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
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all font-medium shadow-lg"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[700px]">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-lg font-bold text-white">Project Notes</h2>
              </div>
              <button
                onClick={() => setShowCreateNote(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all text-sm font-medium shadow-lg"
              >
                + New
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {showCreateNote && (
              <div className="bg-slate-700/30 rounded-xl p-4 mb-4 border border-slate-600 shadow-lg">
                <form onSubmit={createNote} className="space-y-3">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="Note title..."
                    required
                    autoFocus
                  />
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all"
                    placeholder="Note content..."
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateNote(false)}
                      className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all text-sm font-medium shadow-lg"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <svg
                    className="w-12 h-12 mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">No notes yet</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Click "+ New" to create one
                  </p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-slate-700/30 rounded-xl p-4 border border-slate-600 hover:border-green-500/50 transition-all shadow-md group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold text-base">
                        {note.title}
                      </h4>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-sm transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    {note.content && (
                      <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
