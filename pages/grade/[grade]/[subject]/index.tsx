import { useRouter } from "next/router";
import Link from "next/link";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";

import { ReactElement } from "react";
import MainLayout from "../../../../components/MainLayout";
import { Database } from "../../../../supabase/database.types";
import Head from "next/head";

const GradeSubjectLessons = ({
  lessons,
}: {
  lessons: Database["public"]["Tables"]["lessons"]["Row"][];
}) => {
  const router = useRouter();
  const { grade, subject } = router.query;

  const filteredLessons = lessons?.filter(
    (lesson) =>
      lesson.grade.find((lessonGrade) => lessonGrade === grade) &&
      lesson.subject.find((lessonSub) => lessonSub === subject)
  );

  return (
    <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <h1 className="text-2xl font-bold mt-11">
        Lessons for {grade} {subject}
      </h1>
      <h2>
        Lesson ideas, plans, activities and exercises for your {grade} students
        learning {subject}.
      </h2>
      {filteredLessons.length === 0 && (
        <p className="p-8 mt-8 rounded-lg bg-slate-100">
          We don't have any lessons for {grade} {subject} yet.{" "}
          <Link
            href="/lessons/new"
            className="font-bold focus:underline hover:underline"
          >
            Add a lesson
          </Link>{" "}
          to help other teachers out!
        </p>
      )}
      {filteredLessons?.map((lesson) => (
        <Link
          href={`/lessons/${lesson.id}`}
          className="block max-w-xl p-4 my-5 transition bg-white border shadow-md rounded-xl hover:bg-gray-100"
        >
          <h3 className="text-2xl font-bold capitalize">{lesson.title}</h3>
          <p className="mb-2 text-lg text-gray-800">{lesson.overview}</p>
          <p className="flex flex-row gap-3 text-gray-800">
            {" "}
            <span className="px-3 text-center bg-green-200 rounded-full">
              {lesson.grade.filter((l) => l === grade).join(", ")}{" "}
            </span>
            <span className="px-3 text-center bg-orange-100 rounded-full">
              {lesson.subject.join(", ")}
            </span>
          </p>
        </Link>
      ))}
    </div>
  );
};

export default GradeSubjectLessons;

GradeSubjectLessons.getLayout = function getLayout(page: ReactElement) {
  const router = useRouter();
  const { grade, subject } = router.query;
  return (
    <MainLayout>
      <Head>
        <title>
          Free lesson plans & resources for {grade} {subject} | Lesson Robot
        </title>
      </Head>
      {page}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient<Database>(ctx);
  // Check if we have a session
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("public", true);

  return {
    props: {
      lessons: data,
    },
  };
};
