import Image from "next/image";
import Link from "next/link";
import ButtonSignIn from "../reusable/ButtonSignIn";

const Nav = () => {
  return (
    <nav className="sticky top-0 w-full z-50 flex justify-center backdrop-blur-lg bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 shadow-lg shadow-cyan-500/5">
      <div className="w-full max-w-7xl flex justify-between items-center px-6 py-4">
        <div className="flex gap-4 items-center group">
          <Link href="/">
            <Image
              height={56}
              width={56}
              src={"/codecollab.png"}
              alt="logo"
              className="rounded-xl shadow-lg shadow-cyan-500/20"
            />
          </Link>
          <Link href="/" className="sm:block hidden">
            <h1 className="font-bold text-3xl font-mono bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-400 transition-all duration-300">
              CodeCollab
            </h1>
          </Link>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-all duration-300"></div>
          <button className="relative px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <ButtonSignIn />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
