import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ReactElement, useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import LoginPage from "./login";
import { getURL } from "../utils/helpers";

const RegisterPage = () => {
  LoginPage.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout>{page}</MainLayout>;
  };
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  if (!user)
    return (
      <div className="mx-auto w-96">
        <h1 className="mb-4 text-3xl font-bold text-center sm:text-5xl text-slate-900">
          Register
        </h1>
        <h2 className="mb-10 text-xl text-center text-gray-700">
          Start planning your lesson for free!
        </h2>
        <Auth
          view="sign_up"
          redirectTo={`${getURL()}/lessons/new`}
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={["google"]}
          socialLayout="horizontal"
          magicLink
        />
      </div>
    );

  return (
    <>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default RegisterPage;

RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
