import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TypeWriterEffect from "typewriter-effect";
import { MdBolt } from "react-icons/md";
import { Tab } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Button from "../components/Button";

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
      <main className="w-full">
        <div className="flex flex-col items-center flex-1 w-full px-4 mt-20 text-center sm:mt-24">
          <h1
            ref={headingRef}
            aria-label="Create super lesson plans with superhuman speed"
            className="max-w-4xl tracking-tight px-4 text-4xl md:text-6xl font-bold min-h-[108px] sm:text-5xl text-slate-900"
          >
            {loaded && (
              <TypeWriterEffect
                options={{ delay: 80, autoStart: false }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(
                      `Create <span class="text-green-700">super</span> lesson plans <br/>`
                    )
                    .pauseFor(1200)
                    .changeDelay(15)
                    .typeString(
                      `with <span class="text-green-700">superhuman</span> speed!`
                    )
                    .start();
                }}
              ></TypeWriterEffect>
            )}
          </h1>
          <p className="max-w-xl mt-10 text-lg sm:text-xl text-slate-700">
            The future of lesson planning is here. Our AI assistant helps you go
            from <strong>blank slate</strong> to{" "}
            <strong>finished lesson plan</strong> in a flash.
          </p>

          <div className="relative flex flex-col gap-5 mt-16 sm:flex-row">
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
        </div>
        <section className="relative flex flex-col items-center w-full px-4 pb-12 mt-20 bg-gradient-to-tl from-green-500 to-green-900">
          <div className="max-w-2xl mt-16 mb-12 text-center text-white">
            <img
              style={{ width: "15rem" }}
              src="/robot.png"
              alt="smiling nerdy 3d robot"
              className="mx-auto"
            />
            <h2 className="mt-6 text-4xl font-bold ">
              Create a personalized lesson plan with a little help from our AI
              lesson bot.
            </h2>
          </div>
          <div className="pb-4 mb-4 -inset-x-4 bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl">
            <Tab.Group>
              <Tab.List className="flex items-center justify-around p-2 mt-4 space-x-2 sm:p-8 rounded-xl">
                <Tab className="px-5 py-3 text-lg font-bold text-white ui-selected:bg-green-700 rounded-xl">
                  Get activity ideas
                </Tab>
                <Tab className="px-5 py-3 text-lg font-bold text-white ui-selected:bg-green-700 rounded-xl">
                  Lesson plan
                </Tab>
                <Tab className="px-5 py-3 text-lg font-bold text-white ui-selected:bg-green-700 rounded-xl">
                  Stay organized
                </Tab>
              </Tab.List>
              <Tab.Panels className="relative max-w-xl px-4 mx-auto text-lg text-center text-white ">
                <Tab.Panel>
                  Generate ideas for activities tailored specifically to your
                  class.
                </Tab.Panel>
                <Tab.Panel>
                  Auto-generate a custom lesson plan with everything you need,
                  then edit it to your liking.
                </Tab.Panel>
                <Tab.Panel>
                  Keep your lesson plans organized and share your nicely
                  formatted documents.{" "}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            <video
              src="/lesson-go-intro.mp4"
              aria-label="Overview of lesson go: choosing grade, subject, and topic then auto-generating lesson ideas"
              width={"90%"}
              className="max-w-2xl mx-auto mt-8 border-8 rounded-2xl border-white/10 "
              controls
            >
              <p>
                Sorry, it appears your system does not support video playback.
              </p>
            </video>
          </div>
        </section>
        <section className="w-full pt-20">
          <div className="px-1 mx-auto sm:text-center sm:px-8">
            <h2 className="mb-6 text-xl font-bold text-green-700 ">Pricing</h2>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Save hours of time and get back to teaching.
            </h3>
            <p className="max-w-2xl mx-auto mt-6 text-lg leading-8 text-gray-600 ">
              We made it free for you to try Lesson Go, so that you see how much
              it helps you. Give a try, then get your whole year of lesson
              planning done for just $89.
            </p>
            <div className="flex flex-col gap-2 md:flex-row md:space-x-4 space-between">
              <div className="flex flex-col max-w-2xl p-12 mx-auto mt-16 space-y-8 md:w-1/3 rounded-3xl ring-1 ring-gray-200">
                <h4 className="text-2xl font-bold">Free trial</h4>
                <p className="text-gray-600">
                  Create your first 5 lessons free before you commit.
                </p>
                <div>
                  <span className="text-4xl font-bold">$0</span>
                  <span className="font-medium text-gray-600"></span>
                </div>
                <Button variant="outline" fullWidth>
                  Get started
                </Button>
                <div>
                  <ul className="space-y-4">
                    <li className="flex flex-row text-gray-600 text-start">
                      <CheckCircleIcon className="w-5 mr-4 text-green-700 shrink-0" />{" "}
                      5 lessons for free
                    </li>
                    <li className="flex flex-row text-gray-600 text-start">
                      <CheckCircleIcon className="w-5 mr-4 text-green-700 shrink-0" />{" "}
                      Save, organize, and print your lessons
                    </li>
                    <li className="flex flex-row text-gray-600 text-start">
                      <CheckCircleIcon className="w-5 mr-4 text-green-700 shrink-0" />{" "}
                      Access to all features
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col max-w-2xl p-12 mx-auto mt-16 space-y-8 md:w-1/3 rounded-3xl ring-2 ring-green-700">
                <h4 className="text-2xl font-bold">Educator</h4>
                <p className="text-gray-600">
                  Everything you need to plan your lessons for the year.
                </p>
                <div>
                  <span className="text-4xl font-bold">$89</span>
                  <span className="font-medium text-gray-600">/ year</span>
                </div>
                <Button variant="primary" fullWidth>
                  Get started
                </Button>

                <div>
                  <ul className="space-y-4">
                    <li className="flex flex-row text-gray-600 text-start">
                      <CheckCircleIcon className="w-5 mr-4 text-green-700 shrink-0" />{" "}
                      30 lesson plans per month (360 lessons total)
                    </li>
                    <li className="flex flex-row text-gray-600 text-start">
                      <CheckCircleIcon className="w-5 mr-4 text-green-700 shrink-0" />{" "}
                      Save, organize, and print your lessons
                    </li>
                    <li className="flex flex-row text-gray-600 text-start">
                      <CheckCircleIcon className="w-5 mr-4 text-green-700 shrink-0" />{" "}
                      Access to all features
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col max-w-2xl p-12 mx-auto mt-16 space-y-8 md:w-1/3 rounded-3xl ring-1 ring-gray-200">
                <h4 className="text-2xl font-bold">Superplanner</h4>
                <p className="text-gray-600">
                  Unlimited lesson plans for power planners who want to get
                  things done.
                </p>
                <div>
                  <span className="text-4xl font-bold">$200</span>
                  <span className="font-medium text-gray-600">/ year</span>
                </div>
                <Button variant="outline" fullWidth>
                  Get started
                </Button>
                <div>
                  <ul className="space-y-4">
                    <li className="flex flex-row text-gray-600 text-start">
                      <CheckCircleIcon className="w-5 mr-4 text-green-700 shrink-0" />{" "}
                      Unlimited lesson plans for one user.
                    </li>
                    <li className="flex flex-row text-gray-600 text-start">
                      <CheckCircleIcon className="w-5 mr-4 text-green-700 shrink-0" />{" "}
                      Save, organize, and print your lessons
                    </li>
                    <li className="flex flex-row text-gray-600 text-start">
                      <CheckCircleIcon className="w-5 mr-4 text-green-700 shrink-0" />{" "}
                      Access to all features
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
