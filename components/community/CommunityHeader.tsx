"use client";
import { useRouter } from "next/navigation";
import { CommunityHeaderProps } from "@/interfaces";

export default function CommunityHeader({ community }: CommunityHeaderProps) {
  const router = useRouter();

  return (
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
  );
}
