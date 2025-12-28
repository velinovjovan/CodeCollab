import LiveChat from "@/components/LiveChat";
import MakePosts from "@/components/MakePosts";
import Posts from "@/components/Posts";
import Profile from "@/components/Profile";
import ButtonsSign from "@/components/reusable/ButtonSignIn";
import ButtonSignOut from "@/components/reusable/ButtonSignOut";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Profile Floating Widget */}
      <Profile id={user.id} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">
              Connect, share, and collaborate with the community
            </p>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Sidebar - Create Post */}
          <div className="lg:col-span-1 space-y-6">
            <MakePosts />
          </div>

          {/* Center & Right - Chat and Posts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Chat */}
            <LiveChat user={user} />
          </div>
        </div>

        {/* Posts Section - Full Width */}
        <div className="mt-12">
          <Posts />
        </div>
      </div>
    </div>
  );
}
