import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import Editor from "../../../components/Editor";
import MainLayout from "../../../components/MainLayout";
import { Database } from "../../../supabase/database.types";
import { Lesson } from "../../../utils/types";

function ViewLessonPage({ lesson }: { lesson: Lesson }) {
  console.log(lesson);
  return (
    <div>
      <h1 className="text-3xl">{lesson?.title}</h1>
      {lesson.content && <Editor content={lesson?.content} />}
    </div>
  );
}
export default ViewLessonPage;

ViewLessonPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient<Database>(ctx);
  // Check if we have a session
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", ctx.params?.id)
    .single();

  return {
    props: {
      lesson: data,
    },
  };
};
