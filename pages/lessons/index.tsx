import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement, useState } from "react";
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
  const [grades, setGrades] = useState<Array<{ label: string; value: number }>>(
    []
  );
  const [subjects, setSubjects] = useState<
    Array<{ label: string; value: string }>
  >([]);
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="mb-8 text-4xl font-bold mt-11">Lesson plans</h1>
      <div>
        <FormField label="Filter by grades:">
          <DropDown
            value={grades}
            values={gradeValues}
            setValue={(g: Array<{ label: string; value: number }>) =>
              setGrades(g)
            }
          ></DropDown>
        </FormField>
        <FormField label="Filter by Subjects:">
          <DropDown
            value={subjects}
            values={subjectTypes}
            setValue={(g: Array<{ label: string; value: string }>) =>
              setSubjects(g)
            }
          ></DropDown>
        </FormField>
      </div>
      {lessons?.map((lesson) => (
        <Link
          href={`/lessons/${lesson.id}`}
          className="block h-24 p-4 my-5 transition bg-white border shadow-md rounded-xl hover:bg-gray-100"
        >
          <h3 className="text-2xl font-bold capitalize">{lesson.title}</h3>
          <p className="text-gray-800 truncate">{lesson.overview}</p>
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
        <title>Lesson plan templates | Lesson Go: plan lessons with AI</title>
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
