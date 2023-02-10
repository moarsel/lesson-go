import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import { Public_Sans } from "@next/font/google";
import "../styles/globals.css";
import "../styles/editor.css";
import { NextPage } from "next";
import { ReactElement, ReactNode, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

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
      </div>
    </div>
  );
}

export default MyApp;
