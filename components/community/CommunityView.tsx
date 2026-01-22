"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import CommunityHeader from "./CommunityHeader";
import WhiteboardSection from "./WhiteboardSection";
import TeamChat from "./TeamChat";
import ProjectNotes from "./ProjectNotes";
import { CommunityViewProps, CommunityMessage, Note } from "@/interfaces";

const CommunityView = ({ communityId, userId }: CommunityViewProps) => {
  const [community, setCommunity] = useState<any>(null);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInitializedMessagesRef = useRef(false);
  const prevMessageCountRef = useRef(0);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    loadCommunity();
    loadMessages();
    loadNotes();

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
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newMsg = payload.new as any;
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: newMsg.id,
                send_by: newMsg.user_id,
                text: newMsg.content,
                created_at: newMsg.created_at,
              },
            ]);
          }
        },
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
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(notesChannel);
    };
  }, [communityId]);

  useEffect(() => {
    if (!hasInitializedMessagesRef.current) {
      hasInitializedMessagesRef.current = true;
      prevMessageCountRef.current = messages.length;
      return;
    }

    if (messages.length > prevMessageCountRef.current) scrollToBottom();

    prevMessageCountRef.current = messages.length;
  }, [messages]);

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
      .select("id, user_id, content, created_at")
      .eq("community_id", communityId)
      .order("created_at", { ascending: true });

    if (data) {
      setMessages(
        data.map((msg: any) => ({
          id: msg.id,
          send_by: msg.user_id,
          text: msg.content,
          created_at: msg.created_at,
        })),
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
    setLoading(true);

    const { error } = await supabase.from("community_messages").insert({
      community_id: communityId,
      user_id: userId,
      content: messageInput,
    });

    setLoading(false);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setMessageInput("");
    }
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
    loadNotes();
  };

  return (
    <div className="space-y-6">
      <CommunityHeader community={community} />
      <WhiteboardSection communityId={communityId} userId={userId} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamChat
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
          loading={loading}
          userId={userId}
          messagesContainerRef={messagesContainerRef}
        />
        <ProjectNotes
          notes={notes}
          showCreateNote={showCreateNote}
          setShowCreateNote={setShowCreateNote}
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          createNote={createNote}
          deleteNote={deleteNote}
        />
      </div>
    </div>
  );
};

export default CommunityView;
