import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import MainLayout from "../../components/MainLayout";
import { Database } from "../../supabase/database.types";

function LessonsPage({ lessons }: { lessons: any[] }) {
  return (
    <div>
      <h1 className="text-3xl">Lessons</h1>
      <h2>All</h2>
      {lessons?.map((lesson) => (
        <Link
          href={`/lessons/${lesson.id}`}
          className="block p-4 my-5 transition bg-white border shadow-md rounded-xl hover:bg-gray-100"
        >
          <h3>{lesson.title}</h3>
          <p>{lesson.topic}</p>
        </Link>
      ))}
    </div>
  );
}
export default LessonsPage;

LessonsPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient<Database>(ctx);
  // Check if we have a session
  const { data, error } = await supabase.from("lessons").select("*");

  return {
    props: {
      lessons: data,
    },
  };
};
