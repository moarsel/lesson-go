import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 mx-auto">
      <Head>
        <title>Lesson Go!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-col items-center flex-1 w-full px-4 mt-20 text-center sm:mt-24">
        <h1 className="max-w-2xl px-4 text-4xl font-bold sm:text-5xl text-slate-900">
          Create superb lesson plans with superhuman speed 🤖
        </h1>
        <p className="mt-5 text-lg sm:text-2xl text-slate-700">
          Go from no ideas to polished lesson plan in a snap!
        </p>
        <Link
          href="/lessons/new"
          className="w-64 px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
        >
          Get Started
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
