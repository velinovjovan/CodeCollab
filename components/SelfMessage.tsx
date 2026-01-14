import { User } from "@supabase/supabase-js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const SelfMessage = ({ user, text }: { user: User; text: string }) => {
  const [displayName, setDisplayName] = useState<string>("You");
  const [avatarUrl, setAvatarUrl] = useState<string>("/loading.webp");

  useEffect(() => {
    const getUserInfo = async () => {
      const supabase = createClient();
      const { error, data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setDisplayName(data.display_name);
        setAvatarUrl(data.avatar_url);
      }
    };

    getUserInfo();
  }, [user.id]);

  return (
    <div className="flex items-start gap-3 mb-4 justify-end">
      <div className="flex flex-col items-end text-right">
        <p className="text-sm font-semibold text-cyan-400 mb-1">
          {displayName}
        </p>
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl px-4 py-2 border border-cyan-500/50 max-w-sm inline-block text-left">
          <p className="text-white break-words">{text}</p>
        </div>
      </div>
      <div className="rounded-full overflow-hidden w-9 h-9 border-2 border-cyan-400 flex-shrink-0">
        <Image
          src={avatarUrl}
          alt="your-avatar"
          width={36}
          height={36}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default SelfMessage;
