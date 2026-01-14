import LiveChat from "@/components/LiveChat";
import MakePosts from "@/components/MakePosts";
import Posts from "@/components/Posts";
import Profile from "@/components/Profile";
import Communities from "@/components/community/Communities";
import { createClient } from "@/utils/supabase/server";
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
      <Profile id={user.id} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">
              Connect, share, and collaborate with the community
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <Communities userId={user.id} />
          </div>
          <div>
            <LiveChat user={user} />
          </div>
        </div>
        <div className="mb-8">
          <MakePosts />
        </div>
        <div>
          <Posts />
        </div>
      </div>
    </div>
  );
}
