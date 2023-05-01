import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ReactElement, useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import LoginPage from "./login";
import { getURL } from "../utils/helpers";
import { useRouter } from "next/router";
import { Roboto } from "@next/font/google";
import Head from "next/head";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-roboto",
  display: "swap",
});

const RegisterPage = () => {
  LoginPage.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout>{page}</MainLayout>;
  };
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  if (user) router.push(`${router?.query?.redirectTo}`);

  async function googleLogin() {
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getURL(),
      },
    });
  }

  if (!user)
    return (
      <div className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-6 lg:col-start-4">
        <h1 className="mb-4 text-3xl font-bold text-center sm:text-4xl text-slate-900">
          Register
        </h1>
        <h2 className="mb-10 text-xl text-center text-gray-700">
          Start planning your lesson for free!
        </h2>
        <button
          type="button"
          onClick={googleLogin}
          className={`${roboto.className} text-[#3C4043] height-[38px] text-sm w-full text-center flex gap-2 px-4 py-2 items-center transition duration-150 border rounded border-slate-200  hover:bg-[#f8fafe] hover:border-[#d2e3fc] active:bg-[#ecf3fe]`}
        >
          <img
            className="absolute w-5 h-5"
            src="/google-logo.svg"
            loading="lazy"
            alt="google logo"
          />
          <div className="mx-auto">Continue with Google</div>
        </button>

        <div className="w-full mt-7 mb-3 border-slate-150 border-[1px]" />
        <Auth
          view="sign_up"
          redirectTo={`${getURL()}/lessons/new`}
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          magicLink
        />
      </div>
    );
};

export default RegisterPage;

RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Register | Lesson Robot: Lesson plan with AI</title>
      </Head>
      {page}
    </MainLayout>
  );
};
