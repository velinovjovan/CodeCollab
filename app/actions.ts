"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const signInWithOAuthGithub = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
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
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
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
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
  } else {
    redirect(data.url);
  }
};

// Community Actions
export const getCommunities = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching communities:", error);
    return [];
  }
  return data;
};

export const createCommunity = async (
  name: string,
  description: string,
  userId: string
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("communities")
    .insert({ name, description, created_by: userId })
    .select()
    .single();

  if (error) {
    console.error("Error creating community:", error);
    return null;
  }

  // Auto-join creator as admin
  await supabase.from("community_members").insert({
    community_id: data.id,
    user_id: userId,
    role: "admin",
  });

  return data;
};

export const joinCommunity = async (communityId: string, userId: string) => {
  const supabase = await createClient();

  const { error } = await supabase.from("community_members").insert({
    community_id: communityId,
    user_id: userId,
    role: "member",
  });

  if (error) {
    console.error("Error joining community:", error);
    return false;
  }
  return true;
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("community_members")
    .delete()
    .match({ community_id: communityId, user_id: userId });

  if (error) {
    console.error("Error leaving community:", error);
    return false;
  }
  return true;
};
