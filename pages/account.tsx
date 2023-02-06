import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

import { ReactElement } from "react";
import MainLayout from "../components/MainLayout";

function Account() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  return (
    <div className="flex flex-col ">
      <h1 className="mb-3 text-3xl">Account</h1>
      Email: {user?.email}
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
