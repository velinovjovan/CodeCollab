import Link from "next/link";

const Content = () => {
  return (
    <section className="flex flex-1 items-center justify-center px-6">
      <div className="z-10 max-w-3xl text-center flex flex-col items-center gap-6 bg-black/30 backdrop-blur-sm rounded-3xl border border-cyan-500/20 px-8 py-10 shadow-xl shadow-cyan-500/10">
        <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-cyan-300/80 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/30">
          CodeCollab
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
          Build, share, and collaborate on code with your team.
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">
          Spin up collaborative workspaces, chat in-line with your code, and
          ship faster with a modern, social coding hub built for teams.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            Sign in to start
          </Link>
          <span className="text-slate-400 text-sm">
            No setup needed — jump right in.
          </span>
        </div>
      </div>
    </section>
  );
};
export default Content;
