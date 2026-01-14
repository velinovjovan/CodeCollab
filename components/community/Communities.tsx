"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Community {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  member_count?: number;
  is_member?: boolean;
}

const Communities = ({ userId }: { userId: string }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadCommunities();

    // Subscribe to changes
    const channel = supabase
      .channel("communities-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "communities" },
        () => {
          loadCommunities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCommunities = async () => {
    const { data, error } = await supabase
      .from("communities")
      .select(
        `
        *,
        community_members!left(user_id)
      `
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formattedData = data.map((comm: any) => ({
        ...comm,
        member_count: comm.community_members?.length || 0,
        is_member:
          comm.community_members?.some((m: any) => m.user_id === userId) ||
          false,
      }));
      setCommunities(formattedData);
    }
  };

  const createCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from("communities")
      .insert({ name, description, created_by: userId })
      .select()
      .single();

    if (!error && data) {
      // Auto-join creator as member
      await supabase.from("community_members").insert({
        community_id: data.id,
        user_id: userId,
        role: "admin",
      });

      setName("");
      setDescription("");
      setShowCreateModal(false);
      loadCommunities();
    }
    setIsLoading(false);
  };

  const joinCommunity = async (communityId: string) => {
    const { error } = await supabase.from("community_members").insert({
      community_id: communityId,
      user_id: userId,
      role: "member",
    });

    if (!error) {
      loadCommunities();
    }
  };

  const leaveCommunity = async (communityId: string) => {
    const { error } = await supabase
      .from("community_members")
      .delete()
      .match({ community_id: communityId, user_id: userId });

    if (!error) {
      loadCommunities();
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[600px]">
      <div className="flex justify-between items-center p-6 pb-4 border-b border-slate-700">
        <div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Communities
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Create or join collaborative spaces
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all text-sm font-medium shadow-lg"
        >
          + Create
        </button>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Create Community
            </h3>
            <form onSubmit={createCommunity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Community Name
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., React Developers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  placeholder="What's this community about?"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Communities List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {communities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-2">No communities yet</p>
            <p className="text-sm">Create the first one!</p>
          </div>
        ) : (
          communities.map((community) => (
            <div
              key={community.id}
              className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg">
                    {community.name}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    {community.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">
                  {community.member_count}{" "}
                  {community.member_count === 1 ? "member" : "members"}
                </span>
                <div className="flex gap-2">
                  {community.is_member ? (
                    <>
                      <button
                        onClick={() =>
                          router.push(`/global/community/${community.id}`)
                        }
                        className="px-4 py-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-all text-sm font-medium"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => leaveCommunity(community.id)}
                        className="px-4 py-1.5 bg-red-600/80 text-white rounded-lg hover:bg-red-500 transition-all text-sm"
                      >
                        Leave
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => joinCommunity(community.id)}
                      className="px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all text-sm font-medium"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Communities;
