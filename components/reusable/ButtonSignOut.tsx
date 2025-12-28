"use client";

import { signOutAction } from "@/app/actions";

const ButtonSignOut = () => {
  return (
    <button
      onClick={() => signOutAction()}
      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-red-500/50 flex items-center gap-2 group"
    >
      <svg
        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>Sign Out</span>
    </button>
  );
};

export default ButtonSignOut;
