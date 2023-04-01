import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement, useState } from "react";
import Autocomplete from "../../components/Autocomplete";
import DropDown from "../../components/DropDown";
import FormField from "../../components/FormField";
import MainLayout from "../../components/MainLayout";
import { Database } from "../../supabase/database.types";
import { gradeValues, subjectTypes } from "./new";

function LessonsPage({
  lessons,
}: {
  lessons: Database["public"]["Tables"]["lessons"]["Row"][];
}) {
  const [grades, setGrades] = useState<string>("");
  const [subjects, setSubjects] = useState<string>("");

  const filteredLessons = lessons?.filter(
    (lesson) =>
      (!grades.length ||
        lesson.grade.find((lessonGrade) => lessonGrade === grades)) &&
      (!subjects.length ||
        lesson.subject.find((lessonSub) => lessonSub === subjects))
  );
  return (
    <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <h1 className="mb-8 text-4xl font-bold mt-11">Lesson plans</h1>
      <div className="flex flex-row w-full gap-4">
        <Autocomplete
          label="Filter by grades:"
          className="w-56"
          value={""}
          onChange={(e) => setGrades(e)}
          items={gradeValues}
        />

        <Autocomplete
          label="Filter by Subjects:"
          className="w-56"
          value={""}
          onChange={(e) => setSubjects(e)}
          items={subjectTypes}
        />
      </div>
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
              {lesson.grade
                .map((l) => gradeValues.find((v) => v === l))
                .join(", ")}{" "}
            </span>
            <span className="px-3 text-center bg-orange-100 rounded-full">
              {lesson.subject.join(", ")}
            </span>
          </p>
        </Link>
      ))}
    </div>
  );
}
export default LessonsPage;

LessonsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>
          Lesson plan templates | Lesson Robot: plan lessons with AI
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
