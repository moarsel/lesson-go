import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function Header({ children }: { children?: ReactNode }) {
  const user = useUser();
  return (
    <header className="w-full border-b-2 print:hidden">
      <div className="flex items-center justify-between w-full pr-2 mt-5 pb-7 sm:px-16">
        <Link href="/" className="flex items-center space-x-3 ">
          <Image
            alt="Lesson Go"
            src="/lesson-go.svg"
            className="hidden w-10 h-10 sm:w-12 sm:h-12 sm:block"
            width={24}
            height={24}
          />
          <h1 className="ml-2  text-lg uppercase font-[800] tracking-tight [font-variant: all-small-caps] sm:text-2xl whitespace-nowrap">
            Lesson <span className="text-green-700">Go</span>
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
          <div className="flex flex-row items-center gap-2 ml-auto sm:gap-5 ">
            <Link
              href="/login"
              className="px-4 py-2 font-medium whitespace-nowrap"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 font-medium text-white bg-green-600 whitespace-nowrap rounded-xl hover:bg-black/80"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
      {children}
    </header>
  );
}
