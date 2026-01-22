"use client";
import Whiteboard from "./Whiteboard";
import { WhiteboardSectionProps } from "@/interfaces";

export default function WhiteboardSection({
  communityId,
  userId,
}: WhiteboardSectionProps) {
  return (
    <div
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden"
      style={{ height: "calc(100vh - 150px)", minHeight: "900px" }}
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
  );
}
