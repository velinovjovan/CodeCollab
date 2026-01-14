"use client";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Message = ({ user_id, text }: { user_id: string; text: string }) => {
  const [avatar, setAvatar] = useState<string>("/loading.webp");
  const [name, setName] = useState<string>("user");

  useEffect(() => {
    const getUserInfo = async () => {
      const supabase = createClient();
      const { error, data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user_id)
        .single();

      if (!error && data) {
        setAvatar(data.avatar_url);
        setName(data.display_name);
      }
    };
    getUserInfo();
  }, [user_id]);

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="rounded-full overflow-hidden w-9 h-9 border-2 border-cyan-500 flex-shrink-0">
        <Image
          src={avatar}
          alt="user-image"
          width={36}
          height={36}
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-cyan-300 mb-1">{name}</p>
        <div className="bg-slate-700/50 rounded-2xl px-4 py-2 border border-slate-600 max-w-sm inline-block">
          <p className="text-gray-100 break-words">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
