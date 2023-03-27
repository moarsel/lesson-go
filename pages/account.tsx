import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Script from "next/script";

import { ReactElement } from "react";
import MainLayout from "../components/MainLayout";
import { Database } from "../supabase/database.types";
import { postData, getURL } from "../utils/helpers";
import { getStripe } from "../utils/stripe-client";

function Account({
  lessons,
  subscription,
}: {
  lessons: Database["public"]["Tables"]["lessons"][];
  subscription: Database["public"]["Tables"]["subscriptions"][];
}) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  console.log(subscription);

  // if (!user) {
  //   router.push(`/login?returnUrl=${window?.location?.href}`);
  //   return;
  // }

  const successfulSubscribe = router.query.subscribed as string;

  const upgradeRedirect = router.query.upgrade as string;
  if (upgradeRedirect === "pro") {
    handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_PRO ?? "");
  } else if (upgradeRedirect === "super") {
    handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_SUPER ?? "");
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

  return (
    <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <h1 className="mb-3 text-3xl font-bold">Account</h1>
      {successfulSubscribe && (
        <div className="p-4 mb-3 text-white bg-green-700 rounded-xl">
          Welcome aboard! You're successfully subscribed!
        </div>
      )}
      <div>Email: {user?.email}</div>
      <div className="mb-12">{lessons?.length} lesson(s) created</div>
      <Script
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          // @ts-ignore
          window.Tally.openPopup("3Eqjzo");
        }}
      ></Script>
      <button
        className="w-24 px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
export default Account;

Account.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
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
        destination: "/register?redirectTo=/accouont",
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
    .eq("user_id", session?.user.id);

  return {
    props: {
      lessons: data,
      subscription: subscriptionData,
    },
  };
};
