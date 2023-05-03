import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { Rubik } from "@next/font/google";
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

const publicSans = Rubik({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
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
      cancel_on_tap_outside: false,
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
        <Script
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3367525,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
          }}
        ></Script>
      </div>
    </div>
  );
}

export default MyApp;
