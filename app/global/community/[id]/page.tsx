import CommunityView from "@/components/community/CommunityView";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is a member of this community
  const { data: membership } = await supabase
    .from("community_members")
    .select("*")
    .eq("community_id", id)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return redirect("/global");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommunityView communityId={id} userId={user.id} />
      </div>
    </div>
  );
}
