import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { ReactElement, useRef, useState } from "react";
import Editor from "../../../components/Editor";
import FormField from "../../../components/FormField";
import MainLayout from "../../../components/MainLayout";
import { Database } from "../../../supabase/database.types";
import { Lesson } from "../../../utils/types";
import { useLocalStorage } from "../../../utils/useLocalStorage";
import { SectionTypes } from "../new";

function EditLessonPage({ lesson }: { lesson: Lesson }) {
  const supabase = useSupabaseClient<Database>();
  const [local, setLocal] = useLocalStorage<{
    [key: string]: { title: string; content: SectionTypes };
  }>({});
  const router = useRouter();
  const { id } = router.query;
  const editorRef = useRef(null);

  let savedLesson;
  let content;
  if (local) {
    console.log(savedLesson);
    savedLesson = local[`${id}`];
    content =
      lesson.content ||
      `
    ${Object.entries(savedLesson.content).map(([sectionName, sectionData]) => {
      return `
      ## ${sectionName}

${sectionData.content}
`;
    }).join(`
    `)}
  `;
    console.log(content);
  }

  const [title, setTitle] = useState(lesson?.title || savedLesson?.title);

  function handleContentChange(editor: any) {
    editorRef.current = editor;
    console.log(editor);
  }

  async function saveContent() {
    console.log(editorRef.current);
    const { data, error } = await supabase
      .from("lessons")
      .update({ title, content: editorRef.current })
      .eq("id", id)
      .select("*");

    if (data) {
      const updatedStorage = { ...local };
      delete updatedStorage[`${id}`];
      setLocal(updatedStorage);
      router.push(`/lessons/${id}`);
    } else {
      console.warn(error);
    }
  }

  return (
    <div>
      <FormField label="Title" className="pl-3">
        <input
          type="text"
          className="w-full -ml-3 text-3xl print:border-0 border-slate-300 hover:border-slate-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormField>
      {content && (
        <Editor content={content} handleChange={handleContentChange} />
      )}
      <button onClick={saveContent}>Save</button>
    </div>
  );
}
export default EditLessonPage;

EditLessonPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

function getLessons() {}

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
