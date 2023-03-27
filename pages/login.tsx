import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "../components/MainLayout";
import { getURL } from "../utils/helpers";
import Head from "next/head";

const LoginPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const redirect = (router.query.returnUrl as string) ?? "/lessons/new";

  if (user) router.push(redirect);

  if (!user)
    return (
      <div className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-6 lg:col-start-4">
        <h2 className="mb-3 text-3xl font-bold text-center sm:text-4xl text-slate-900">
          Login
        </h2>
        <h2 className="mb-12 text-xl text-center text-gray-700">
          Finish lesson planning in a snap 🤖
        </h2>
        <Auth
          view="sign_in"
          redirectTo={`${getURL()}${redirect}}`}
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={["google"]}
          socialLayout="horizontal"
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
