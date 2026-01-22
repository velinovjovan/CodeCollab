import SignInMain from "@/components/signInPage/SignInMain";
import Nav from "@/components/landingPage/Nav";
import Footer from "@/components/landingPage/Footer";
import Code from "@/components/backgrounds/code";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Login() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/");
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col relative">
        <Nav />
        <div className="absolute inset-0 -z-10">
          <Code />
        </div>
        <section className="flex flex-1 items-center justify-center px-6 py-12">
          <SignInMain />
        </section>
        <Footer />
      </div>
    </main>
  );
}
