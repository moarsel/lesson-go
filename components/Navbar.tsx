import { PencilIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import LinkButton from "./LinkButton";

function Navbar() {
  const user = useUser();
  const router = useRouter();

  return (
    <div className="flex items-center w-full h-12 col-span-12 gap-5 py-8 text-center sm:gap-10 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <Link
        href="/lessons"
        className="relative h-8 font-bold sm:font-medium sm:text-xl"
      >
        Browse Lessons
        <div
          className={`${
            router.pathname == "/lessons"
              ? "bg-green-600 h-2 w-full rounded-full bottom-[-21px] absolute"
              : ""
          }`}
        ></div>
      </Link>
      {user && (
        <Link
          href="/my-lessons"
          className="relative h-8 font-bold sm:font-medium sm:text-xl"
        >
          My Lessons
          <div
            className={`${
              router.pathname == "/my-lessons"
                ? "bg-green-600 h-2 w-full rounded-full bottom-[-21px] absolute"
                : ""
            }`}
          ></div>
        </Link>
      )}
      <LinkButton
        variant="outline"
        href="/lessons/new"
        className="relative mb-2 ml-auto sm:text-lg"
      >
        New Lesson
        <PencilSquareIcon className="hidden md:block" width={24} />
      </LinkButton>
    </div>
  );
}

export default Navbar;
