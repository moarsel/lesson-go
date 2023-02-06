import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const user = useUser();
  const router = useRouter();
  return (
    <header className="w-full print:hidden">
      <div className="flex items-center justify-between w-full px-2 mt-5 border-b-2 pb-7 sm:px-4">
        <Link href="/" className="flex items-center space-x-3 ">
          <Image
            alt="Lesson Go"
            src="/lesson-go.svg"
            className="w-10 h-10 sm:w-12 sm:h-12"
            width={24}
            height={24}
          />
          <h1 className="ml-2 text-2xl font-[650] tracking-tight [font-variant: all-small-caps] sm:text-3xl">
            Lesson Go!
          </h1>
        </Link>

        {user && (
          <Link href="/account">
            <div className="flex items-center justify-center w-12 h-12 text-3xl uppercase rounded-full bg-slate-400">
              {user?.email?.substring(0, 1)}
            </div>
          </Link>
        )}
        {!user && (
          <div className="flex flex-row items-center gap-6">
            <Link href="/login" className="px-4 py-2 font-medium">
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 font-medium text-white bg-green-600 rounded-xl hover:bg-black/80"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
      {user && (
        <div className="flex items-center w-full h-12 gap-12 p-8 border-b-2">
          <Link href="/lessons/new" className="relative text-xl font-medium">
            New Lesson
            <div
              className={`  ${
                router.pathname == "/lessons/new"
                  ? "bg-green-600 h-2 w-full rounded-full bottom-[-23px] absolute"
                  : ""
              }`}
            ></div>
          </Link>{" "}
          <Link href="/lessons" className="relative text-xl font-medium">
            Lessons plans
            <div
              className={`${
                router.pathname == "/lessons"
                  ? "bg-green-600 h-2 w-full rounded-full bottom-[-23px] absolute"
                  : ""
              }`}
            ></div>
          </Link>
        </div>
      )}
    </header>
  );
}
