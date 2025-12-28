import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const ButtonsSign = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <span onClick={signOutAction}>Sign Out</span>
  ) : (
    <Link href={"sign-in"}>Sign in</Link>
  );
};

export default ButtonsSign;
