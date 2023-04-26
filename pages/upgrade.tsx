import { ReactElement } from "react";
import MainLayout from "../components/MainLayout";
import Image from "next/image";
import Header from "../components/Header";
import LinkButton from "../components/LinkButton";

function Upgrade() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <Header />
      <main className="w-full">
        <section className="relative flex flex-col items-center w-full min-h-screen px-4 pb-12 mx-auto bg-gradient-to-tl from-green-400 to-green-800">
          <div className="mt-16 mb-12 text-center text-white ">
            <h1 className="max-w-2xl mx-auto mt-6 mb-6 text-5xl font-bold leading-tight">
              Time to power up your lesson planning
            </h1>
            <div className="flex flex-col items-center justify-around w-full gap-8 px-4 mt-8 ">
              <Image
                style={{ width: "14rem" }}
                src="/robot.png"
                alt="smiling nerdy 3d robot"
                className="self-center"
                width={320}
                height={320}
                priority
              />
              <div className="max-w-xl text-center">
                <h2 className="w-full mt-2 mb-2 text-3xl font-medium">
                  Upgrade to create more lessons
                </h2>
                <p className="text-lg">
                  You've used up your lesson credits, but you can upgrade to
                  unlock the full power of Lesson Robot.
                </p>
                <div className="flex flex-col gap-2 mt-10 md:flex-row">
                  <LinkButton
                    href="/account?upgrade=pro"
                    fullWidth
                    className=""
                  >
                    Upgrade to Pro
                  </LinkButton>
                  <LinkButton
                    variant="outline"
                    fullWidth
                    href="/account?upgrade=unlimited"
                    className=" !bg-green-700 border-green-900"
                  >
                    Upgrade to Unlimited{" "}
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Upgrade;
