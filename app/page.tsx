import Navbar from "@/components/globals/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col">
    <Navbar/>

      <section className="h-screen w-full bg-neutral-950 rounded-md !overflow-visible relative flex flex-col items-center antialiased">
        <div className="absolute inset-0 h-full w-full items-center px-5 py-24 bg-[radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
      </section>
      <div className="flex flex-col mt-[-100px] md:mt-[-50px]">
      {
        //continue with component-scroll
      }
      </div>
    </main>
  );
}
