import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl min-h-screen py-2 mx-auto">
      <Header />
      <main className="flex flex-col flex-1 w-full px-4 mt-10 sm:mt-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
