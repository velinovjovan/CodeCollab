"use client";

import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Profile = (id: any) => {
  const [avatar, setAvatar] = useState<string>("/loading.webp");
  const [name, setName] = useState<string>("user");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      const supabase = createClient();

      const { error, data } = await supabase
        .from("users")
        .select("*")
        .eq("id", id.id)
        .single();

      if (!error && data) {
        setAvatar(data.avatar_url);
        setName(data.display_name);
      }
    };

    getInfo();
  }, [id.id]);

  return (
    <div className="fixed left-4 bottom-4 z-50">
      {/* Collapsed Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
            <Image
              src={avatar}
              alt="profile-thumb"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <span>{name}</span>
        </button>
      )}

      {/* Expanded Profile Card */}
      {isOpen && (
        <div className="animate-in slide-in-from-left duration-300 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all shadow-2xl w-72">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Your Profile
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="rounded-full overflow-hidden w-24 h-24 border-4 border-cyan-500 mb-4 shadow-lg">
              <Image
                src={avatar}
                alt="user-image"
                width={96}
                height={96}
                className="object-cover"
                priority
              />
            </div>

            <p className="text-xl font-bold text-white text-center mb-4">
              {name}
            </p>

            <div className="w-full pt-4 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <p className="text-sm font-semibold text-cyan-400">Active</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Member</p>
                  <p className="text-sm font-semibold text-cyan-400">
                    Since Now
                  </p>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => signOutAction()}
              className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2 group"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
