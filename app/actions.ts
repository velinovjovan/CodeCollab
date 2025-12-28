"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  console.log("jej");
  return redirect("/sign-in");
};

export const signInWithOAuthGithub = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `https://codecollab-jowan.vercel.app/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
  } else {
    redirect(data.url);
  }
};

export const signInWithOAuthDiscord = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `https://codecollab-jowan.vercel.app/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
  } else {
    redirect(data.url);
  }
};

export const signInWithOAuthGoogle = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `https://codecollab-jowan.vercel.app/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
  } else {
    redirect(data.url);
  }
};
