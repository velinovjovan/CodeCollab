"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface PostType {
  id: number;
  title: string;
  content: string;
  created_at: string;
  made_by: string;
}

const Post = ({ post }: { post: PostType }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("/loading.webp");
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const getInfo = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", post.made_by)
        .single();

      if (!error && data) {
        setName(data.display_name);
        setAvatar(data.avatar_url);
      }
    };

    // Format timestamp
    const date = new Date(post.created_at);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) setTimestamp("Just now");
    else if (minutes < 60) setTimestamp(`${minutes}m ago`);
    else if (hours < 24) setTimestamp(`${hours}h ago`);
    else if (days < 7) setTimestamp(`${days}d ago`);
    else setTimestamp(date.toLocaleDateString());

    getInfo();
  }, [post.made_by, post.created_at]);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all shadow-xl hover:shadow-2xl">
      {/* Author Info */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="rounded-full overflow-hidden w-12 h-12 border-2 border-cyan-500 flex-shrink-0">
            <Image
              src={avatar}
              alt="user-image"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-white font-semibold">{name}</p>
            <p className="text-xs text-gray-500">{timestamp}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
          {post.content}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-700 flex justify-between items-center">
        <div className="text-xs text-gray-500">ID: {post.id}</div>
        <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default Post;
