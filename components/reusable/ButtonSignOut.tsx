import { signOutAction } from "@/app/actions";

const ButtonSignOut = async () => {
  return <span onClick={signOutAction}>Sign Out</span>;
};

export default ButtonSignOut;
