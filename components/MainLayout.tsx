import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="absolute w-full mx-auto sr-only focus-within:not-sr-only focus-within:shadow-outline">
        <a
          href="#main"
          className="absolute inline-block px-4 py-2 leading-tight text-black no-underline bg-white border border-transparent rounded-none select-none hover:bg-grey-lightest focus:bg-grey-lightest focus:shadow-outline"
        >
          Skip to main content
        </a>
      </div>
      <div className="flex flex-col items-center justify-start min-h-screen py-2 mx-auto">
        <Header>
          <Navbar />
        </Header>

        <main
          id="main"
          className="grid w-full grid-cols-12 px-5 mt-10 sm:mt-12"
        >
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default MainLayout;
