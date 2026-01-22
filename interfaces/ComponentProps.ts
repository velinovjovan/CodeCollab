import { RefObject } from "react";
import { CommunityMessage } from "./CommunityMessage";
import { Note } from "./Note";

export interface CommunityViewProps {
  communityId: string;
  userId: string;
}

export interface CommunityHeaderProps {
  community: {
    name: string;
    description: string;
  } | null;
}

export interface WhiteboardSectionProps {
  communityId: string;
  userId: string;
}

export interface WhiteboardProps {
  communityId: string;
  userId: string;
}

export interface TeamChatProps {
  messages: CommunityMessage[];
  messageInput: string;
  setMessageInput: (value: string) => void;
  sendMessage: (e: React.FormEvent) => void;
  loading: boolean;
  userId: string;
  messagesContainerRef: RefObject<HTMLDivElement | null>;
}

export interface ProjectNotesProps {
  notes: Note[];
  showCreateNote: boolean;
  setShowCreateNote: (value: boolean) => void;
  noteTitle: string;
  setNoteTitle: (value: string) => void;
  noteContent: string;
  setNoteContent: (value: string) => void;
  createNote: (e: React.FormEvent) => void;
  deleteNote: (noteId: string) => void;
}
