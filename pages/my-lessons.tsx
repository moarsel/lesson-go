import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import MainLayout from "../components/MainLayout";
import { Database } from "../supabase/database.types";
import LinkButton from "../components/LinkButton";

function MyLessonsPage({
  lessons,
}: {
  lessons: Database["public"]["Tables"]["lessons"]["Row"][];
}) {
  return (
    <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <h1 className="mb-8 text-4xl font-bold mt-11">My Lesson Plans</h1>
      {!lessons.length && (
        <p className="flex flex-col items-start gap-6 my-5">
          You have no lessons yet.{" "}
          <LinkButton href="/lessons/new">Create your first lesson</LinkButton>
        </p>
      )}
      {lessons?.map((lesson) => (
        <Link
          href={`/lessons/${lesson.id}`}
          key={lesson.id}
          className="block h-20 max-w-xl p-4 my-5 transition bg-white border shadow-md rounded-xl hover:bg-gray-100"
        >
          <h3 className="text-xl font-bold capitalize">{lesson.title}</h3>
          <p className="text-gray-800 truncate">{lesson.overview}</p>
        </Link>
      ))}
    </div>
  );
}
export default MyLessonsPage;

MyLessonsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>My Lesson Plans | Lesson Robot: Lesson plan with AI</title>
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
