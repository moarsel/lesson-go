import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 mx-auto">
      <Header>
        <Navbar />
      </Header>

      <main className="grid w-full grid-cols-12 px-5 mt-10 sm:mt-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
