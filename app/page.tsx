import Code from "@/components/backgrounds/code";
import Content from "@/components/landingPage/Content";
import Footer from "@/components/landingPage/Footer";
import Nav from "@/components/landingPage/Nav";

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col relative">
        <Nav />
        <div className="absolute inset-0 -z-10">
          <Code />
        </div>
        <Content />
        <Footer />
      </div>
    </main>
  );
}
