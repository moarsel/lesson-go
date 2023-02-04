import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full px-2 mt-5 border-b-2 pb-7 sm:px-4">
      <Link href="/" className="flex items-center space-x-3 ">
        <Image
          alt="Lesson Go"
          src="/lesson-go.svg"
          className="w-10 h-10 sm:w-14 sm:h-14"
          width={32}
          height={32}
        />
        <h1 className="ml-2 text-2xl font-bold tracking-tight sm:text-4xl">
          Lesson Go!
        </h1>
      </Link>
      <a href="/">
        <div className="w-12 h-12 rounded-full bg-slate-400" />
      </a>
    </header>
  );
}
