import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Script from "next/script";

import { ReactElement } from "react";
import MainLayout from "../components/MainLayout";
import { Database } from "../supabase/database.types";

function Account({
  lessons,
}: {
  lessons: Database["public"]["Tables"]["lessons"][];
}) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  return (
    <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <h1 className="mb-3 text-3xl">Account</h1>
      <div>Email: {user?.email}</div>
      <div className="mb-12">{lessons?.length} lesson(s) created</div>
      <Script
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          // @ts-ignore
          // window.Tally.openPopup("3Eqjzo");
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

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("user_id", session?.user.id);

  return {
    props: {
      lessons: data,
    },
  };
};
