"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState } from "react";

const MakePosts = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = async (e: any) => {
    e.preventDefault();

    const supabase = createClient();

    if (!title || !content) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("posts").insert({ title, content });

    if (!error) {
      setTitle("");
      setContent("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all shadow-xl">
      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Share Your Project
      </p>
      <form onSubmit={submitPost} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Title
            <span className="text-xs text-gray-400 ml-1">
              ({title.length}/50)
            </span>
          </label>
          <input
            type="text"
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            placeholder="My Amazing Project"
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description
            <span className="text-xs text-gray-400 ml-1">
              ({content.length}/1700)
            </span>
          </label>
          <textarea
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
            placeholder="Tell us about your project..."
            maxLength={1700}
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!title || !content || isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50"
        >
          {isSubmitting ? "Publishing..." : "Publish Project"}
        </button>
      </form>
    </div>
  );
};

export default MakePosts;
