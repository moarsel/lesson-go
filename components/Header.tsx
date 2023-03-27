import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function Header({ children }: { children?: ReactNode }) {
  const user = useUser();
  return (
    <header className="grid w-full grid-cols-12 px-4 border-b-2 print:hidden">
      <div className="flex items-center justify-between w-full col-span-12 mt-5 pb-7 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
        <Link href="/" className="flex items-center ">
          <h1 className=" text-lg  font-[800] tracking-tight [font-variant: all-small-caps] sm:text-2xl whitespace-nowrap">
            Lesson <span className="text-green-700">Robot</span>
          </h1>
        </Link>

        {user && (
          <Link
            href="/account"
            className="px-4 py-2 font-medium whitespace-nowrap"
          >
            My Account
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
              className="px-4 py-2 font-medium text-white bg-green-700 whitespace-nowrap rounded-xl hover:bg-black/80"
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
