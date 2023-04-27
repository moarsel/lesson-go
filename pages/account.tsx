import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Script from "next/script";

import { ReactElement } from "react";
import Button from "../components/Button";
import MainLayout from "../components/MainLayout";
import { Database } from "../supabase/database.types";
import { postData, getURL } from "../utils/helpers";
import { getStripe } from "../utils/stripe-client";
import Head from "next/head";

function Account({
  lessons,
  subscription,
}: {
  lessons: Database["public"]["Tables"]["lessons"]["Row"][];
  subscription: Database["public"]["Tables"]["subscriptions"]["Row"];
}) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const monthLessonCount = lessons?.filter(
    (l) => new Date(l.created_at ?? "").getMonth() === new Date().getMonth()
  ).length;

  const successfulSubscribe = router.query.subscribed as string;

  const upgradeRedirect = router.query.upgrade as string;
  if (upgradeRedirect === "pro") {
    handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_PRO ?? "");
  } else if (upgradeRedirect === "unlimited") {
    handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_UNLIMITED ?? "");
  }

  async function handleCheckout(priceId: string) {
    try {
      const { sessionId } = await postData<{ sessionId: string }>({
        url: "/api/create-checkout-session",
        data: {
          price: priceId,
          return_url: `${getURL()}/account?subscribed=true`,
        },
      });

      // TODO: analytics
      // event('checkout-session', { label: price.id });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      // TODO: error handling
      if ((error as Error).message === "exists") {
        // `Please visit your account page to update your existing subscription.`,
      } else {
        // `Sorry, we had error on our side. Please try again later. ${
      }
    }
  }

  async function redirectToCustomerPortal() {
    try {
      const { url, error } = await postData<{ url: string; error: Error }>({
        url: "/api/create-portal-link",
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  }

  return (
    <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <h1 className="mb-2 text-3xl font-bold">Account</h1>
      <p className="mb-8 text-lg">
        Logged in as <strong className="font-medium">{user?.email}</strong>
      </p>
      {successfulSubscribe && (
        <div className="p-4 mb-3 text-white bg-green-700 rounded-xl">
          Welcome aboard! You're successfully subscribed!
        </div>
      )}

      <div className="flex flex-col gap-3 p-4 ring-2 ring-slate-200 rounded-xl">
        {subscription?.status === "active" &&
          subscription?.price_id ===
            process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_PRO && (
            <>
              <h2 className="text-xl font-semibold">
                {30 - monthLessonCount} / 30 lesson credits remaining for this
                month.
              </h2>
              <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className="h-3 bg-blue-600 rounded-full"
                  style={{ width: `${(monthLessonCount / 30) * 100}%` }}
                ></div>
              </div>
              <p>
                Get a prorated{" "}
                <button
                  onClick={redirectToCustomerPortal}
                  className="inline mb-2 font-bold underline underline-offset-2 hover:no-underline"
                >
                  upgrade to Unlimited
                </button>
                .
              </p>
            </>
          )}

        {lessons && (!subscription || subscription?.status !== "active") && (
          <div className="flex flex-col gap-3 p-4">
            <h2>You've used {lessons?.length}/5 free lessons credits.</h2>
            <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className="h-3 bg-blue-600 rounded-full"
                style={{ width: `${Math.min(lessons?.length / 5, 1) * 100}%` }}
              ></div>
            </div>
            <Button
              onClick={() =>
                handleCheckout(
                  process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_PRO ?? ""
                )
              }
            >
              Upgrade to Pro
            </Button>
          </div>
        )}

        {subscription && subscription?.status === "active" && (
          <>
            <Button onClick={redirectToCustomerPortal}>
              Manage your subscription
            </Button>
            <p>
              Your subscription will renew on{" "}
              {new Date(subscription?.current_period_end).toLocaleDateString()}.
            </p>
          </>
        )}
      </div>
      {/* <Script
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          // @ts-ignore
          window.Tally.openPopup("3Eqjzo");
        }}
      ></Script> */}
      <Button
        className="mt-4"
        variant="outline"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
      >
        Logout
      </Button>
    </div>
  );
}
export default Account;

Account.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Account | Lesson Robot</title>
      </Head>
      {page}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient<Database>(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/register?redirectTo=/account",
        permanent: false,
      },
    };

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("user_id", session?.user.id);

  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session?.user.id)
    .single();

  return {
    props: {
      lessons: data,
      subscription: subscriptionData,
    },
  };
};
