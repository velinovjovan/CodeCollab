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
    // <div className="flex-1 w-full flex flex-col gap-12 md:px-24 px-10 py-24">
    //   <div className="w-full flex gap-52 lg:flex-nowrap flex-wrap">
    //     <div>
    //       <Profile id={user.id} />
    //       <MakePosts />
    //     </div>
    //     <LiveChat user={user} />
    //   </div>
    //   <div>
    //     <Posts />
    //   </div>
    // </div>
    <ButtonSignOut />
  );
}
