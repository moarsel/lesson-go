import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "../components/MainLayout";

const LoginPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  if (user) router.push("/lessons/new");

  if (!user)
    return (
      <div className="mx-auto w-96">
        <h2 className="mb-3 text-3xl font-bold text-center sm:text-5xl text-slate-900">
          Login
        </h2>
        <h2 className="mb-12 text-xl text-center text-gray-700">
          Finish lesson planning in a snap 🤖
        </h2>
        <Auth
          view="sign_in"
          redirectTo="http://localhost:3000/"
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
  return <MainLayout>{page}</MainLayout>;
};
