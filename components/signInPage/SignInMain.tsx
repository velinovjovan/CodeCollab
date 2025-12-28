import Image from "next/image";
import GoogleBtn from "./GoogleBtn";
import GithubBtn from "./GithubBtn";
import DiscrodBtn from "./DiscrodBtn";

const SignInMain = () => {
  return (
    <div className="w-full max-w-md backdrop-blur-lg bg-gray-900/80 rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
      <div className="p-10 space-y-8">
        <div className="text-center space-y-4">
          <Image
            src={"/codecollab.png"}
            alt="logo"
            width={80}
            height={80}
            className="mx-auto rounded-2xl shadow-lg shadow-cyan-500/30"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Welcome to CodeCollab
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in to start collaborating
          </p>
        </div>
        <div className="space-y-3">
          <GoogleBtn />
          <GithubBtn />
          <DiscrodBtn />
        </div>
      </div>
    </div>
  );
};
export default SignInMain;
