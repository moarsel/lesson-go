import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "../components/MainLayout";
import { getURL } from "../utils/helpers";
import Head from "next/head";
import { Roboto } from "@next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-roboto",
});

const LoginPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const redirect = (router.query.returnUrl as string) ?? "/lessons/new";

  async function googleLogin() {
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getURL(),
      },
    });
  }

  if (user) router.push(redirect);

  if (!user)
    return (
      <div className="col-span-12 sm:col-span-5 sm:col-start-5 lg:col-span-4 lg:col-start-5">
        <h1 className="mb-3 text-3xl font-bold text-center sm:text-4xl text-slate-900">
          Login
        </h1>
        <h2 className="mb-12 text-xl text-center text-gray-700">
          Finish your lesson plans in a flash 🤖
        </h2>
        <button
          type="button"
          onClick={googleLogin}
          className={`${roboto.className} text-sm w-full text-center flex gap-2 px-4 py-2 items-center transition duration-150 border rounded border-slate-200 text-slate-700 hover:bg-[#f8fafe] hover:border-[#d2e3fc] active:bg-[#ecf3fe]`}
        >
          <img
            className="absolute w-5 h-5"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
          />
          <div className="mx-auto">Continue with Google</div>
        </button>

        <div className="w-full mt-4 border-slate-150 border-[1px]" />
        <Auth
          view="sign_in"
          redirectTo={`${getURL()}${redirect}`}
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          magicLink
        />
      </div>
    );
};

export default LoginPage;

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Login | Lesson Robot: Lesson plan with AI</title>
      </Head>
      {page}
    </MainLayout>
  );
};
