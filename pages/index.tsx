import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TypeWriterEffect from "typewriter-effect";

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
          aria-label="Create superb lesson plans with superhuman speed"
          className="max-w-2xl px-4 text-4xl font-bold sm:text-5xl text-slate-900"
        >
          {loaded && (
            <TypeWriterEffect
              options={{ delay: 90, autoStart: false }}
              onInit={(typewriter) => {
                typewriter
                  .typeString("Create super lesson plans")
                  .pauseFor(1200)
                  .changeDelay(15)
                  .typeString(
                    ` with super speed ${String.fromCodePoint(129302)}`
                  )
                  .start();
              }}
            ></TypeWriterEffect>
          )}
        </h1>
        <p className="mt-5 text-lg sm:text-2xl text-slate-700">
          Go from no ideas to polished lesson plan in a snap!
        </p>
        <Link
          href="/register?redirectTo=/lessons/new"
          className="w-64 px-4 py-2 mt-8 font-medium text-white bg-black border-2 border-black rounded-xl sm:mt-10 hover:bg-black/80"
        >
          Plan my lesson <span className="ml-2"> ⚡️</span>
        </Link>
        <Link
          href="/lessons/"
          className="w-64 px-4 py-2 mt-8 font-medium border-2 border-black rounded-xl sm:mt-10 hover:bg-gray-100/80"
        >
          Browse Lesson Plans
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
