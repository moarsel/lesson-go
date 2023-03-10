import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TypeWriterEffect from "typewriter-effect";
import { MdBolt } from "react-icons/md";

const Home: NextPage = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [loaded, setLoaded] = useState(false);
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 mx-auto">
      <Head>
        <title>Lesson Go!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-col items-center flex-1 w-full px-4 mt-20 text-center sm:mt-24">
        <h1
          ref={headingRef}
          aria-label="Create super lesson plans with superhuman speed"
          className="max-w-2xl px-4 text-4xl font-bold min-h-[96px] sm:text-5xl text-slate-900"
        >
          {loaded && (
            <TypeWriterEffect
              options={{ delay: 80, autoStart: false }}
              onInit={(typewriter) => {
                typewriter
                  .typeString("Create super lesson plans")
                  .pauseFor(1200)
                  .changeDelay(15)
                  .typeString(` with superhuman speed!`)
                  .start();
              }}
            ></TypeWriterEffect>
          )}
        </h1>
        <p className="mt-10 text-lg sm:text-xl text-slate-700">
          Go from <strong>blank slate</strong> to{" "}
          <strong>finished lesson plan</strong> in a flash.
        </p>
        <p className="max-w-xl mt-2 text-lg sm:text-xl text-slate-700">
          Let our AI guide you through the process of creating a personalized
          lesson plan for your students.
        </p>
        <div className="flex flex-col gap-5 mt-16 sm:flex-row">
          <Link
            href="/lessons/new"
            className="flex items-center justify-center w-64 gap-2 px-4 py-2 font-medium text-white bg-black border-2 border-black rounded-xl hover:bg-black/80"
          >
            Plan my lesson <MdBolt className="text-2xl " />
          </Link>
          <Link
            href="/lessons/"
            className="w-64 px-4 py-2 font-medium border-2 border-black rounded-xl hover:bg-gray-100/80"
          >
            Browse Lesson Plans
          </Link>
        </div>

        <h2 className="mt-32 mb-6 text-lg font-bold">
          Want a sneak peak before you log in?
        </h2>
        <video
          src="/lesson-go-intro.mp4"
          aria-label="Overview of lesson go: choosing grade, subject, and topic then auto-generating lesson ideas"
          width={"90%"}
          className="max-w-2xl border-2 border-black rounded-xl"
          controls
        >
          <p>Sorry, it appears your system does not support video playback.</p>
        </video>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
