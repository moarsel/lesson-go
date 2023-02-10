import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

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
    <div className="flex flex-col px-12">
      <h1 className="mb-3 text-3xl">Account</h1>
      Email: {user?.email}
      <span>{lessons?.length} lesson(s) created</span>
      {/* <iframe data-tally-src="https://tally.so/embed/3Eqjzo?transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="482" frameborder="0" marginheight="0" marginwidth="0" title="Lesson Go Signup"></iframe><script>var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}</script> */}
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
