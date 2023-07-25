import { useRouter } from "next/router";
import Link from "next/link";
import { ReactElement } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";

import MainLayout from "../../../components/MainLayout";
import { Database } from "../../../supabase/database.types";
import { subjectTypes } from "../../lessons/new";
import Head from "next/head";

const GradeSubjects = ({
  lessons,
}: {
  lessons: Database["public"]["Tables"]["lessons"]["Row"][];
}) => {
  const router = useRouter();
  const { grade } = router.query;

  const filteredLessons = lessons?.filter((lesson) =>
    lesson.grade.find((lessonGrade) => lessonGrade === grade)
  );

  return (
    <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <h1 className="pb-2 text-2xl font-bold mt-11">Lessons for {grade}</h1>
      <h2 className="mb-8">
        Here are some lesson plans, assessments, and worksheets we have for{" "}
        {grade}. You can also select a subject to narrow down to {grade} lessons
        for a specific subject.{" "}
      </h2>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="p-6 border border-gray-200 rounded-lg ">
          <p className="text-sm text-gray-500">Lesson Plans by Subject</p>
          <div className="flex flex-col gap-2 mt-1">
            {subjectTypes.map((v) => (
              <Link href={`/grade/${grade}/${v}`}>{v}</Link>
            ))}
          </div>
        </div>
        {filteredLessons.length === 0 && (
          <p className="p-8 mt-8 rounded-lg bg-slate-100">
            We don't have any lessons for {grade} yet.{" "}
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
            className="self-start block max-w-xl p-4 mb-5 transition bg-white border shadow-md rounded-xl hover:bg-gray-100"
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
    </div>
  );
};

export default GradeSubjects;

GradeSubjects.getLayout = function getLayout(page: ReactElement) {
  const router = useRouter();
  const { grade, subject } = router.query;
  return (
    <MainLayout>
      <Head>
        <title>Free lesson plans & resources for {grade} | Lesson Robot</title>
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
