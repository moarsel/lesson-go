import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { Public_Sans } from "@next/font/google";
import jwtDecode from "jwt-decode";
import "../styles/globals.css";
import "../styles/editor.css";
import { NextPage } from "next";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Script from "next/script";
import { getURL } from "../utils/helpers";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageWithLayout;
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const getLayout = Component.getLayout ?? ((page) => page);
  const [gAPILoaded, setGAPILoaded] = useState(false);

  async function loginWithGoogle({ credential }: { credential: string }) {
    const decoded = jwtDecode(credential) as { email?: string };
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: { login_hint: decoded?.email || "" },
        redirectTo: getURL(),
      },
    });
  }

  async function googleOneTapPrompt() {
    // @ts-ignore
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: loginWithGoogle,
    });

    // @ts-ignore
    window.google.accounts.id.prompt((notification) => {
      console.log("login notification", notification);
    });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && gAPILoaded) {
        googleOneTapPrompt();
      }
    });
  }, [gAPILoaded]);

  return (
    <div className={`${publicSans.variable} font-sans`}>
      <div id="headlessui-portal-root">
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={pageProps.initialSession}
        >
          {getLayout(<Component {...pageProps} />)}
          <Analytics />
        </SessionContextProvider>
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          onLoad={() => {
            setGAPILoaded(true);
          }}
        ></Script>
      </div>
    </div>
  );
}

export default MyApp;
