import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";

function Navbar() {
  const user = useUser();
  const router = useRouter();

  return (
    <div className="flex items-center w-full h-12 gap-5 px-3 py-8 text-center sm:gap-12 sm:px-16">
      <Link
        href="/lessons/new"
        className="relative h-8 font-bold sm:font-medium sm:text-xl"
      >
        New Lesson
        <div
          className={`  ${
            router.pathname == "/lessons/new"
              ? "bg-green-600 h-2 w-full rounded-full bottom-[-21px] absolute"
              : ""
          }`}
        ></div>
      </Link>{" "}
      <Link
        href="/lessons"
        className="relative h-8 font-bold sm:font-medium sm:text-xl"
      >
        Lesson plans
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
    </div>
  );
}

export default Navbar;
