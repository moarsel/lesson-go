import { CheckIcon } from "@heroicons/react/20/solid";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import {
  MdAssignmentTurnedIn,
  MdLightbulb,
  MdListAlt,
  MdPostAdd,
  MdQuiz,
} from "react-icons/md";
import Autocomplete from "../../components/Autocomplete";
import Button from "../../components/Button";
import Editor from "../../components/Editor/Editor";
import MainLayout from "../../components/MainLayout";
import Pill from "../../components/Pill";
import Suggestions from "../../components/Suggestions";
import Textarea from "../../components/Textarea";
import { Database } from "../../supabase/database.types";
import { useLocalStorage } from "../../utils/useLocalStorage";
import RoboCard from "../../components/RoboCard";
import Select from "../../components/Select";

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
        activityIdeas: `Generate 3 lesson plan activity ideas for ${studentDemographic} lesson with on the topic of ${topic}, labelled "1.", "2.", or "3.". Make sure they are age appropriate, specific, engaging and practical for a single lesson. Each generated activity should be maximum 20 words (don't include a word count).`,
        activity: "",
        selectedResource: "",
        resourceIdeas: `What are 3 creative examples of learning materials chatgpt could generate for a ${studentDemographic} for this activity: ${sections.activity.content}. Make sure each example is max 35 words in the form of a prompt where the output would just be text. Only suggest age appropriate examples with no quizzes, no videos, no cards or flashcards, no graphics or pictures or images, no websites, no interactive anything.  It should not be a prompt for students but a printable learning material they could use. Output only a numbered list in markdown with no text before or after.`,
        resource: `Generate a well formatted markdown student printable with lots of whitespace for this prompt: "${sections.selectedResource.content}" Make it specific and appropriate to ${studentDemographic}. Output only the worksheet content without any intro or conclusion. You can add tables and text but don't add images.`,
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
        description={
          <>
            <span className="font-bold">Hint:</span> Be specific about what your
            students need to learn and their particular interests.
          </>
        }
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        rows={2}
        placeholder={"e.g. Fun with fractions in nature"}
      />

      <AnimatePresence mode="wait">
        {topic && grade && subject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <RoboCard
              title="Brainstorm activity ideas"
              icon={<MdLightbulb className="text-5xl " />}
            >
              <p className="text-lg ">
                Suggest{" "}
                <Select
                  value=""
                  onChange={() => false}
                  label="activity type"
                  options={[
                    { label: "10 minute warmup", value: "10 minute warmup" },
                  ]}
                />
                activity ideas for a lesson on{" "}
                <span className="font-medium">{topic}</span>.
              </p>
              <div className="flex flex-col">
                <Button
                  variant="primary"
                  className="w-24 mt-4"
                  onClick={(e) => {
                    if (Boolean(subject.length && grade.length)) {
                      generateContent("activityIdeas");
                      setSectionContent("activity", "");
                    }
                  }}
                  loading={loading}
                  disabled={Boolean(!subject.length || !grade.length)}
                >
                  {sections.activityIdeas.content && !loading ? (
                    "Try again ↺"
                  ) : (
                    <>
                      Suggest activities <MdLightbulb className="text-lg" />
                    </>
                  )}
                </Button>
              </div>

              <div ref={activitiesRef} className="">
                {!sections.activity.content && (
                  <Suggestions
                    content={sections.activityIdeas.content}
                    onSelect={(item: string) =>
                      setSectionContent("activity", item)
                    }
                  />
                )}
              </div>

              {sections.activity.content && (
                <Textarea
                  label="Selected Activity"
                  description={
                    <div className="flex flex-row items-center justify-between">
                      Feel free to tweak this your needs.
                    </div>
                  }
                  value={sections.activity.content}
                  onChange={(e) =>
                    setSectionContent("activity", e.target.value)
                  }
                  rows={3}
                  className="mt-2"
                />
              )}
            </RoboCard>
          </motion.div>
        )}

        {topic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            ref={detailsRef}
          >
            <RoboCard
              title="Generate a Lesson Plan"
              icon={<MdListAlt className="text-5xl" />}
            >
              <p className="mb-4">
                Write a{" "}
                <Select
                  value=""
                  onChange={() => false}
                  label="activity type"
                  options={[
                    {
                      label: "lesson plan summary table",
                      value: "lesson plan summary table",
                    },
                    {
                      label: "5 part lesson plan",
                      value: "5 part lesson plan",
                    },
                  ]}
                />
                lesson plan summary for a {studentDemographic} lesson for the
                selected activity.
              </p>

              <Button onClick={() => generateContent("plan")} loading={loading}>
                <MdListAlt className="text-lg" />
                {!sections.plan.content ? "Generate Plan" : "Try again ↺"}
              </Button>
              {sections.plan.content && (
                <div className="p-6 border border-slate-100">
                  <Editor
                    content={sections.plan.content}
                    onChange={(value) => setSectionContent("plan", value)}
                  />
                </div>
              )}
            </RoboCard>
          </motion.div>
        )}

        {topic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <RoboCard
              title="Add Printable Resource"
              icon={<MdPostAdd className="text-5xl" />}
            >
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
                  : "Suggest printable resources →"}
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
                    label="Printable Resource Description"
                    description="Feel free to change this if you get bad results."
                    value={sections.selectedResource.content}
                    onChange={(e) =>
                      setSectionContent("selectedResource", e.target.value)
                    }
                    rows={3}
                    className="mt-2"
                  />
                  <Button
                    onClick={() => generateContent("resource")}
                    loading={loading}
                  >
                    <MdPostAdd className="text-lg" />
                    Create printable
                  </Button>
                  <div className="p-6 border border-slate-100">
                    <Editor
                      content={sections.resource.content}
                      onChange={(value) => setSectionContent("resource", value)}
                    />
                  </div>
                </>
              )}
            </RoboCard>
          </motion.div>
        )}

        {topic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <RoboCard
              title="Generate Assessment"
              icon={<MdQuiz className="text-5xl" />}
            >
              <p className="mb-4">
                Generate a{" "}
                <Select
                  value=""
                  onChange={() => false}
                  label="activity type"
                  options={[
                    { label: "Multiple choice", value: "Multiple choice" },
                  ]}
                />{" "}
                for a {studentDemographic} lesson on {topic}.
              </p>
              <Button
                onClick={() => generateContent("assessment")}
                loading={loading}
              >
                <MdQuiz className="text-lg" />
                Create Assessment
              </Button>
              {sections.assessment.content && (
                <div className="p-6 border border-slate-100">
                  <Editor
                    content={sections.assessment.content}
                    onChange={(value) => setSectionContent("assessment", value)}
                  />
                </div>
              )}
            </RoboCard>
          </motion.div>
        )}
      </AnimatePresence>

      {Boolean(sections.plan.content || sections.activity.content) && (
        <>
          <Button onClick={saveContent} loading={loading}>
            <MdAssignmentTurnedIn className="text-lg" /> Finish lesson plan
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
