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
import { useRouter } from "next/router";
import Image from "next/image";
import LinkButton from "../components/LinkButton";

const Home: NextPage = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 mx-auto">
      <Head>
        <title>Lesson Robot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="w-full">
        <div className="flex flex-col items-center flex-1 w-full px-4 mt-8 text-center sm:mt-8">
          <h1
            ref={headingRef}
            aria-label="Create super lesson plans with superhuman speed"
            className="max-w-4xl mt-5 tracking-tight px-4 text-3xl md:text-6xl font-bold sm:min-h-[120px] sm:text-5xl text-slate-900"
          >
            {loaded && (
              <TypeWriterEffect
                options={{ delay: 60, autoStart: false }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(
                      `Create <span class="text-green-600">super</span> lesson plans <br/>`
                    )
                    .pauseFor(1200)
                    .changeDelay(10)
                    .typeString(
                      `with <span class="text-green-600">superhuman</span> speed!`
                    )
                    .start();
                }}
              ></TypeWriterEffect>
            )}
          </h1>
          <Image
            style={{ width: "18rem" }}
            src="/robot.png"
            alt="smiling nerdy 3d robot"
            className="mx-auto mt-3"
            width={288}
            height={288}
            priority
          />
          <p className="max-w-xl mt-6 text-lg sm:text-xl text-slate-700">
            The future of lesson planning is here. Our AI assistant helps you go
            from <strong>blank slate</strong> to{" "}
            <strong>finished lesson plan</strong> in a flash.
          </p>

          <div className="relative flex flex-col gap-5 mt-6 sm:flex-row">
            <Link
              href="/lessons/new"
              className="flex items-center justify-center w-64 gap-2 px-4 py-2 font-medium text-white bg-black border-2 border-black rounded-xl hover:bg-black/80"
            >
              Plan my lesson <MdBolt className="text-2xl " />
            </Link>
          </div>
        </div>
        <section className="relative flex flex-col items-center w-full px-4 pb-12 mt-20 bg-gradient-to-tl from-green-400 to-green-800">
          <div className="max-w-2xl mt-16 mb-12 text-center text-white">
            <h2 className="mt-6 text-4xl font-[600] leading-normal">
              Personalize your lesson plans with a little help from our AI
              lesson robot.
            </h2>
          </div>
          <div className="pb-4 mb-4 -inset-x-4 bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl">
            <Tab.Group>
              <Tab.List className="flex flex-col items-stretch justify-around p-2 mt-4 mb-2 space-x-2 sm:items-center sm:flex-row sm:p-8 rounded-xl">
                <Tab className="px-5 py-3 text-lg font-medium text-white ui-selected:bg-green-900 rounded-xl">
                  Activity ideas
                </Tab>
                <Tab className="px-5 py-3 text-lg font-medium text-white ui-selected:bg-green-900 rounded-xl">
                  Lesson plans
                </Tab>
                <Tab className="px-5 py-3 text-lg font-medium text-white ui-selected:bg-green-900 rounded-xl">
                  Assessments
                </Tab>
                <Tab className="px-5 py-3 text-lg font-medium text-white ui-selected:bg-green-900 rounded-xl">
                  Stay organized
                </Tab>
              </Tab.List>
              <Tab.Panels className="relative max-w-xl px-4 mx-auto text-lg text-center text-white ">
                <Tab.Panel>
                  Generate ideas for activities tailored specifically to your
                  class.
                  <Link
                    href="/lessons/new"
                    className="relative flex items-center justify-center transition-all group "
                  >
                    <img
                      className="my-8 shadow-lg ring-4 ring-white/20 group-hover:brightness-50"
                      src="screenshot-1.png"
                      width={"100%"}
                      alt="screenshot of activity suggestsions for a chosen topic: grade 4 charlotte's web."
                    />
                    <span className="absolute px-8 py-4 text-2xl font-medium text-transparent bg-transparent rounded group-hover:bg-white group-hover:text-black ">
                      Try it now
                    </span>
                  </Link>
                </Tab.Panel>
                <Tab.Panel>
                  Auto-generate a custom lesson plan with everything you need,
                  then edit it to your liking.
                  <Link
                    href="/lessons/new"
                    className="relative flex items-center justify-center transition-all group "
                  >
                    <img
                      className="my-8 shadow-lg ring-4 ring-white/20 group-hover:brightness-50"
                      src="screenshot-2.png"
                      width={"100%"}
                      alt="screenshot of a lesson plan Charlotte's web including warmup, materials, direct instruction"
                    />
                    <span className="absolute px-8 py-4 text-2xl font-medium text-transparent bg-transparent rounded group-hover:bg-white group-hover:text-black ">
                      Try it now
                    </span>
                  </Link>
                </Tab.Panel>
                <Tab.Panel>
                  Save the hassle of finding or creating assessments materials
                  from scratch. We'll draft custom assessment questions based on
                  your lesson.
                  <Link
                    href="/lessons/new"
                    className="relative flex items-center justify-center transition-all group "
                  >
                    <img
                      className="my-8 shadow-lg ring-4 ring-white/20 group-hover:brightness-50"
                      src="screenshot-3.png"
                      width={"100%"}
                      alt="screenshot of a fill in the blank questions about Charlotte's web."
                    />
                    <span className="absolute px-8 py-4 text-2xl font-medium text-transparent bg-transparent rounded group-hover:bg-white group-hover:text-black ">
                      Try it now
                    </span>
                  </Link>
                </Tab.Panel>
                <Tab.Panel>
                  Keep your lesson plans organized and share your nicely
                  formatted documents.{" "}
                  <Link
                    href="/lessons/new"
                    className="relative flex items-center justify-center transition-all group "
                  >
                    <img
                      className="my-8 shadow-lg ring-4 ring-white/20 group-hover:brightness-50"
                      src="screenshot-4.png"
                      width={"100%"}
                      alt="screenshot of a list of lesson plan previews"
                    />
                    <span className="absolute px-8 py-4 text-2xl font-medium text-transparent bg-transparent rounded group-hover:bg-white group-hover:text-black ">
                      Try it now
                    </span>
                  </Link>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </section>
        <section className="w-full pt-20">
          <div className="px-4 mx-auto sm:text-center sm:px-8">
            <h2 className="mb-6 text-xl font-bold text-green-700 ">Pricing</h2>
            <h3 className="text-3xl font-[700] leading-normal text-gray-900 sm:text-4xl">
              Save hours of time and get back to teaching.
            </h3>
            <p className="max-w-2xl mx-auto mt-6 text-lg font-[400] leading-relaxed text-gray-600 ">
              We made it free for you to try Lesson Robot, so that you see just
              how much it helps. Give it a try, then get your whole year of
              lesson planning done for just $59.
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
                <LinkButton href="/lessons/new" variant="outline" fullWidth>
                  Get started
                </LinkButton>
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
                <h4 className="text-2xl font-bold">Pro</h4>
                <p className="text-gray-600">
                  Everything you need to plan your lessons for the year.
                </p>
                <div>
                  <p className="mb-2 text-lg text-red-700 line-through">
                    $120 regular price
                  </p>
                  <span className="text-4xl font-bold">$59</span>
                  <span className="font-medium text-gray-600">/ year</span>
                  <p>for early adopters</p>
                </div>
                <LinkButton
                  href="/login?returnUrl=/account?upgrade=pro"
                  variant="primary"
                  fullWidth
                >
                  Get started
                </LinkButton>

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
                <h4 className="text-2xl font-bold">Unlimited</h4>
                <p className="text-gray-600">
                  For educators who want to be unstoppable planning machines.
                </p>
                <div>
                  <p className="mb-2 text-lg text-red-700 line-through">
                    $385 regular price
                  </p>
                  <span className="text-4xl font-bold">$189</span>
                  <span className="font-medium text-gray-600">/ year</span>
                  <p>for early adopters</p>
                </div>
                <LinkButton
                  href="/login?returnUrl=/account?upgrade=unlimited"
                  variant="outline"
                  fullWidth
                >
                  Get started
                </LinkButton>
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
