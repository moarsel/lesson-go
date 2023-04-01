import { CheckIcon } from "@heroicons/react/20/solid";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import { MdLightbulb } from "react-icons/md";
import Autocomplete from "../../components/Autocomplete";
import Button from "../../components/Button";
import Editor from "../../components/Editor/Editor";
import MainLayout from "../../components/MainLayout";
import Pill from "../../components/Pill";
import Suggestions from "../../components/Suggestions";
import Textarea from "../../components/Textarea";
import { Database } from "../../supabase/database.types";
import { useLocalStorage } from "../../utils/useLocalStorage";

export type GradeType =
  | "Pre-K"
  | "Kindergarten"
  | "Grade 1"
  | "Grade 2"
  | "Grade 3"
  | "Grade 4"
  | "Grade 5"
  | "Grade 6"
  | "Grade 7"
  | "Grade 8"
  | "Grade 9"
  | "Grade 10"
  | "Grade 11"
  | "Grade 12"
  | "Post secondary"
  | "Adult education"
  | "All ages";

export const gradeValues = [
  "Pre-K",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Adult education",
  "Post secondary",
  "All ages",
];

export type SubjectType =
  | "English language arts"
  | "Math"
  | "Science"
  | "Arts"
  | "History"
  | "Geography"
  | "Social and emotional learning"
  | "Social studies"
  | "Special education"
  | "English as a second language"
  | "Other";

export const subjectTypes: Array<string> = [
  "Arts",
  "English language arts",
  "English as a second language",
  "Geography",
  "History",
  "Math",
  "Science",
  "Social and emotional learning",
  "Social studies",
  "Special education",
  "Other",
];

export type SectionData = {
  content: string;
  description: string;
  prompt: string;
};
export type SectionTypes = {
  activityIdeas: SectionData;
  activity: SectionData;
  resourceIdeas: SectionData;
  selectedResource: SectionData;
  resource: SectionData;
  plan: SectionData;
  assessment: SectionData;
};

export async function generateFromPrompt(prompt: string): Promise<any> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = response.body;
  if (!data) {
    return Promise.reject();
  }
  return Promise.resolve(data);
}

function New() {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [localData, setLocalData] = useLocalStorage({});
  const router = useRouter();
  const activitiesRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const studentDemographic = `${grade} ${subject === "Other" ? "" : subject}`;
  const defaultContent = {
    activity: {
      prompt: "",
      content: "",
    },
    activityIdeas: {
      prompt: ``,
      content: "",
    },
    resource: {
      prompt: ``,
      content: "",
    },
    selectedResource: {
      prompt: ``,
      content: "",
    },
    resourceIdeas: {
      prompt: ``,
      content: "",
    },
    plan: {
      prompt: ``,
      content: "",
    },
    assessment: {
      prompt: ``,
      content: "",
    },
  } as SectionTypes;

  const [sections, setSections] = useState<SectionTypes>(defaultContent);

  useEffect(() => {
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    }, 1500);
  }, [Boolean(sections.plan.content)]);

  function setSectionContent(type: keyof SectionTypes, contentValue: string) {
    setSections({
      ...sections,
      [type]: { ...sections[type], content: contentValue },
    });
  }

  async function generateContent(type: keyof SectionTypes) {
    setSectionContent(type, "");
    setLoading(true);

    const getPrompts = (type: keyof SectionTypes) => {
      return {
        activityIdeas: `Generate 3 lesson plan activity ideas for ${studentDemographic} lesson with on the topic of ${topic}, labelled "1.", "2.", or "3.". Make sure they are age appropriate, specific, engaging and practical for a single lesson. Each generated activity should be maximum 35 words (don't include a word count).`,
        activity: "",
        selectedResource: "",
        resourceIdeas: `What are 3 creative examples of learning materials chatgpt could generate for a ${studentDemographic} for this activity: ${sections.activity.content}. Make sure each example is max 35 words in the form of a prompt where the output would just be text. No videos, no quiz, no cards, no graphics, no websites, no interactive anything.  It should not be a prompt for students but a learning material they could use. Output the only a numbered list in markdown with no text before or after.`,
        resource: `Generate a well formatted markdown student resource with lots of whitespace for this prompt: "${sections.selectedResource.content}" Make it specific and appropriate to ${studentDemographic}.`,
        plan: `Create ${studentDemographic} lesson plan that meets these goals: ${sections.activity.content}. The plan should be formatted in markdown with sections for warmup and materials (side by side), direct instruction (full row), guided practice (full row), and differentiation (full row). Make it specific, realistic, concise, and practical, there should be no h1 title.`,
        assessment: `My ${studentDemographic} students are doing this activity: ${sections.activity.content}. After we've done this, I will use a quiz as a formative assessment of their learning. Output a quiz with a few different question formats, with whitespace for the students to write. The answers should only be in an answer key at the end. Output should be in markdown format and there should be no h1 title.`,
      }[type];
    };

    try {
      const data = await generateFromPrompt(getPrompts(type));

      if (data) {
        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          setSections((prev) => ({
            ...prev,
            [type]: { ...prev[type], content: prev[type].content + chunkValue },
          }));
        }
      }
    } catch (e) {
      console.warn(e);
    }
    console.log("done");
    setLoading(false);
  }

  async function saveContent() {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        user_id: user?.id,
        title: topic,
        overview: sections.activity.content,
        subject: [subject],
        grade: [grade],
        content: sections,
      })
      .select("id")
      .single();

    if (data && data.id) {
      // setLocalData({
      //   [data.id]: {
      //     user_id: user?.id,
      //     title: topic,
      //     subject: subject,
      //     content: sections,
      //   },
      // });
      router.push(`/lessons/${data.id}`);
    } else {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen col-span-12 mt-10 sm:col-span-8 sm:col-start-2 lg:col-span-6 lg:col-start-3">
      <h1 className="mb-5 text-3xl font-bold sm:text-4xl text-slate-900">
        First, who is this lesson for?
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Autocomplete
          label="Grade"
          className="w-full"
          value={""}
          onChange={(e) => setGrade(e)}
          items={gradeValues}
        />

        <Autocomplete
          className="w-full"
          label="Subject"
          value={""}
          onChange={(e) => setSubject(e)}
          items={subjectTypes}
        />
      </div>

      <Textarea
        label="Topic"
        description="What will students learn about?"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        rows={2}
        placeholder={
          "e.g. Students will be able to identify the parts of a flower."
        }
      />

      <AnimatePresence mode="wait">
        {topic && grade && subject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 ring-2 ring-black/10 rounded-xl"
          >
            <h2
              id="activities"
              className="flex flex-row gap-3 mx-auto text-xl font-bold sm:text-2xl text-slate-900"
            >
              Brainstorm activity ideas
            </h2>
            <p className="my-2">
              Suggest ideas for a {studentDemographic} lesson on {topic}.
            </p>
            <div className="flex flex-row flex-wrap gap-4">
              <Pill selected={false}>10 minute warmup</Pill>
              <Pill selected={false}>cumulative project</Pill>
            </div>
            <Button
              className={`w-full md:w-80 px-4 py-2 mt-4 font-medium text-white rounded-xl  hover:bg-black/80 ${
                Boolean(subject.length && grade.length)
                  ? "bg-black "
                  : "bg-neutral-500 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (Boolean(subject.length && grade.length)) {
                  generateContent("activityIdeas");
                  setSectionContent("activity", "");
                }
              }}
              loading={loading}
              disabled={Boolean(!subject.length || !grade.length)}
            >
              {sections.activityIdeas.content
                ? "Try again"
                : "Suggest activities"}
              <MdLightbulb />
            </Button>

            <div ref={activitiesRef} className="">
              {!sections.activity.content && (
                <Suggestions
                  content={sections.activityIdeas.content}
                  onSelect={(item: string) =>
                    setSectionContent("activity", item)
                  }
                />
              )}
              {sections.activity.content && (
                <Textarea
                  label="Selected Activity"
                  description="Feel free to tweak this your needs."
                  value={sections.activity.content}
                  onChange={(e) =>
                    setSectionContent("activity", e.target.value)
                  }
                  rows={3}
                  className="w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
                />
              )}
            </div>
          </motion.div>
        )}

        {sections.activity.content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 mt-8 ring-2 ring-black/10 rounded-xl"
            ref={detailsRef}
          >
            <h2 className="mx-auto mb-8 text-3xl font-bold sm:text-4xl text-slate-900">
              Great, now let's finish the lesson plan!
            </h2>
            <p className="mb-4">
              Generate a lesson plan summary for a {studentDemographic} lesson
              on {topic}.
            </p>
            <div className="flex flex-row flex-wrap gap-3">
              <Pill selected>Summary table</Pill>
              <Pill>5 part lesson plan</Pill>
            </div>
            <Button onClick={() => generateContent("plan")} loading={loading}>
              Generate Plan
            </Button>
            {sections.plan.content && (
              <div className="flex flex-col w-full gap-4 mb-8">
                <Editor
                  content={sections.plan.content}
                  onChange={(value) => setSectionContent("plan", value)}
                />
              </div>
            )}
          </motion.div>
        )}
        {sections.plan.content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 mt-8 ring-2 ring-black/10 rounded-xl"
          >
            <h2
              id="activities"
              className="text-xl font-bold sm:text-2xl text-slate-900"
            >
              Create learning materials
            </h2>
            <Button
              className={`w-full md:w-80 px-4 py-2 mt-2 font-medium text-white rounded-xl  hover:bg-black/80 ${
                Boolean(subject.length && grade.length)
                  ? "bg-black "
                  : "bg-neutral-500 cursor-not-allowed"
              }`}
              onClick={(e) =>
                Boolean(subject.length && grade.length) &&
                generateContent("resourceIdeas")
              }
              loading={loading}
              disabled={Boolean(!subject.length || !grade.length)}
            >
              {sections.resourceIdeas.content
                ? "Try one more time ↺"
                : "Suggest lesson materials →"}
            </Button>

            {!sections.selectedResource.content && (
              <Suggestions
                content={sections.resourceIdeas.content}
                onSelect={(item: string) =>
                  setSectionContent("selectedResource", item)
                }
              />
            )}
            {sections.selectedResource.content && (
              <>
                <Textarea
                  label="Selected Resource"
                  description="Feel free to tweak this your needs."
                  value={sections.selectedResource.content}
                  onChange={(e) =>
                    setSectionContent("selectedResource", e.target.value)
                  }
                  rows={3}
                  className="w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
                />
                <Button
                  onClick={() => generateContent("resource")}
                  loading={loading}
                >
                  Create!
                </Button>
                <Editor
                  content={sections.resource.content}
                  onChange={(value) => setSectionContent("resource", value)}
                />
              </>
            )}
          </motion.div>
        )}

        {sections.plan.content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 mt-8 ring-2 ring-black/10 rounded-xl"
          >
            <h3 className="mx-auto mb-8 text-3xl font-bold sm:text-4xl text-slate-900">
              Assessment
            </h3>
            <p className="mb-4">
              Generate a multiple choice assessment for a {studentDemographic}{" "}
              lesson on {topic}.
            </p>
            <div className="flex flex-row flex-wrap gap-3">
              <Pill selected>Multiple choice</Pill>
              <Pill>Reflection questions</Pill>
            </div>
            <Editor
              content={sections.assessment.content}
              onChange={(value) => setSectionContent("assessment", value)}
            />

            <Button
              onClick={() => generateContent("assessment")}
              loading={loading}
            >
              Generate Assessment
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {sections.plan.content && (
        <>
          <Button onClick={saveContent} loading={loading}>
            Create lesson plan!
          </Button>
        </>
      )}
    </div>
  );
}

export default New;

New.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Create a lesson | Lesson Robot AI</title>
      </Head>
      {page}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/register?redirectTo=/lessons/new",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      // user: session.user,
    },
  };
};
