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
  MdPrint,
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

export const curriculumTypes: Array<string> = [
  "Common Core State Standards (CCSS)",
  "Next Generation Learning Standards (NGLS)",
  "Ontario Curriculum",
  "International Baccalaureate (IB)",
  "Advanced Placement (AP)",
  "Montessori",
  "Texas Essential Knowledge and Skills (TEKS)",
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
  const [activityType, setActivityType] = useState("fun 10 minute warmup");
  const [lessonPlanType, setLessonPlanType] = useState(
    "quick lesson plan summary"
  );
  const [assessmentType, setAssessmentType] = useState("multiple choice");
  const [subject, setSubject] = useState("");
  const [curriculum, setCurriculum] = useState("");
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
    setSections((state) => ({
      ...state,
      [type]: { ...state[type], content: contentValue },
    }));
  }

  async function generateContent(type: keyof SectionTypes) {
    setSectionContent(type, "");
    setLoading(true);

    const lessonPlanTypes = {
      "quick lesson plan summary":
        "Create a concise lesson plan with a section for materials, objectives, structure, and wrap up. It should include time estimates for each section.",
      "5 part lesson plan":
        "Write an thoughtful lesson plan including objectives, direct instruction (with a list of key concepts), guided practice (20-40 words), closure, and independent practice",
      "detailed 7 part lesson plan":
        "Write an expert lesson plan including objectives, materials, anticipatory set, direct instruction [input, modeling, and check for understanding], guided practice, closure, and independent practice",
    } as any;
    const getPrompts = (type: keyof SectionTypes) => {
      const curriculumType = curriculum
        ? ` for the ${curriculum} curriculum.`
        : "";
      const includeCurriculum = curriculum
        ? `include a very brief but accurate section listing any curriculum standards met in the ${curriculum} curriculum (up to 15 words each). `
        : "";

      return {
        activityIdeas: `Generate 3 lesson plan ${activityType} for ${studentDemographic} lesson with on the topic of ${topic}, labelled "1.", "2.", or "3.". Make sure they are age appropriate, specific, engaging and practical${curriculumType} for a single lesson. Each generated activity should be maximum 20 words (don't include a word count).`,
        activity: "",
        selectedResource: "",
        resourceIdeas: `What are 3 creative examples of learning materials chatgpt could generate in plain text for a ${studentDemographic} for this activity: ${sections.activity.content} on the topic of ${topic}. One example should be wacky and fun. Make sure each example is max 35 words in the form of a prompt where the output would just be text (don't include the word count). Only suggest age appropriate examples with no quizzes, no videos, no cards or flashcards, no graphics or pictures or images, no websites, no interactive anything. It should not be a prompt for students but a printable learning material they could use. Output only a numbered list in markdown with no text before or after.`,
        resource: `Generate a well formatted markdown student printable with adequate whitespace for this prompt: "${sections.selectedResource.content}" Make it specific and appropriate to ${studentDemographic}. Output only the worksheet content without any intro or conclusion. You can add tables and text but do not add images or links.`,
        plan: `${lessonPlanTypes[lessonPlanType]}. It is for a ${studentDemographic} class on the topic of ${topic}. ${includeCurriculum} Make it specific, realistic, concise, and practical.`,
        assessment: `My ${studentDemographic} students are doing this activity: ${sections.activity.content} on the topic of ${topic}. After the lesson, I will use a quiz as a formative assessment of their learning. Output a quiz with ${assessmentType} question formats about the activity, with appropriate whitespace for the students to write. The answers should only be in an answer key at the end. Output should be in markdown format.`,
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
      <div className="flex flex-col gap-4 lg:flex-row">
        <Autocomplete
          label="Grade"
          className="w-full"
          value={grade}
          onChange={(e) => setGrade(e)}
          items={gradeValues}
        />

        <Autocomplete
          className="w-full"
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e)}
          items={subjectTypes}
        />
        <Autocomplete
          className="w-full"
          label="Curriculum (optional)"
          value={curriculum}
          onChange={(e) => setCurriculum(e)}
          items={curriculumTypes}
        />
      </div>

      <Textarea
        label="Topic"
        description={
          <>
            <span className="font-bold">Hint:</span> be specific about what your
            students will learn and their particular interests.
          </>
        }
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        rows={2}
        placeholder={"e.g. Fun with fractions in nature"}
      />

      <AnimatePresence>
        {topic && grade && subject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key="activityIdeas"
          >
            <RoboCard
              defaultOpen={true}
              title="Brainstorm activity ideas"
              icon={<MdLightbulb className="text-5xl " />}
            >
              <p className="text-lg ">
                Suggest{" "}
                <Select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  label="activity type"
                  options={[
                    {
                      label: "fun 10 minute warmup",
                      value: "fun 10 minute warmup",
                    },
                    {
                      label: "45 minute classroom",
                      value: "45 minute classroom",
                    },
                    {
                      label: "collaborative group",
                      value: "collaborative group",
                    },
                    { label: "inquiry based", value: "inquiry based" },
                  ]}
                />
                activity ideas for a lesson on{" "}
                <span className="font-medium">{topic}</span>.
              </p>
              <div className="flex flex-column">
                <Button
                  variant="primary"
                  className="w-24 mt-4 mb-6 ml-auto"
                  onClick={() => {
                    if (Boolean(subject.length && grade.length)) {
                      setSectionContent("activity", "");
                      generateContent("activityIdeas");
                    }
                  }}
                  loading={loading}
                  disabled={Boolean(!subject.length || !grade.length)}
                >
                  <MdLightbulb className="text-lg" />
                  {sections.activityIdeas.content && !loading ? (
                    "Try again ↺"
                  ) : (
                    <>Suggest activities</>
                  )}
                </Button>
              </div>
              {sections.activityIdeas.content && !sections.activity.content && (
                <h2 className="text-lg font-medium ">
                  Hmm, how about selecting one of these?
                </h2>
              )}

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
                />
              )}
            </RoboCard>
          </motion.div>
        )}

        {sections.activity.content && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            ref={detailsRef}
          >
            <RoboCard
              title="Draft a Lesson Plan"
              icon={<MdListAlt className="text-5xl" />}
            >
              <p className="mb-4">
                Write a{" "}
                <Select
                  value={lessonPlanType}
                  onChange={(e) => setLessonPlanType(e.target.value)}
                  label="lesson plan type"
                  options={[
                    {
                      label: "quick lesson plan summary",
                      value: "quick lesson plan summary",
                    },
                    {
                      label: "5 part lesson plan",
                      value: "5 part lesson plan",
                    },
                    {
                      label: "detailed 7 part lesson plan",
                      value: "detailed 7 part lesson plan",
                    },
                  ]}
                />
                for a {studentDemographic} lesson for the selected activity.
              </p>

              <Button
                className="ml-auto"
                onClick={() => generateContent("plan")}
                loading={loading}
              >
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

        {sections.plan.content && (
          <motion.div
            key="printables"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <RoboCard
              title="Add Printable Resource"
              icon={<MdPostAdd className="text-5xl" />}
            >
              <p className="mb-4">
                Suggest ideas for lesson resources that can be printed and
                handed out for the lesson.{" "}
              </p>
              <Button
                className={`w-full ml-auto md:w-80 px-4 py-2 mt-2 font-medium text-white rounded-xl  hover:bg-black/80 ${
                  Boolean(subject.length && grade.length)
                    ? "bg-black "
                    : "bg-neutral-500 cursor-not-allowed"
                }`}
                onClick={(e) => {
                  if (subject.length && grade.length) {
                    setSectionContent("resourceIdeas", "item");
                    setSectionContent("selectedResource", "item");
                    generateContent("resourceIdeas");
                  }
                }}
                loading={loading}
                disabled={Boolean(!subject.length || !grade.length)}
              >
                <MdPrint />
                {sections.resourceIdeas.content
                  ? "Try again ↺"
                  : "Suggest resources"}
              </Button>
              <div className="w-full">
                {!sections.selectedResource.content && (
                  <Suggestions
                    content={sections.resourceIdeas.content}
                    onSelect={(item: string) =>
                      setSectionContent("selectedResource", item)
                    }
                  />
                )}
              </div>
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

        {sections.plan.content && (
          <motion.div
            key="assessment"
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
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  label="activity type"
                  options={[
                    { label: "multiple choice", value: "multiple choice" },
                    { label: "short answer", value: "short answer" },
                    {
                      label: "open ended critical thinking",
                      value: "open ended critical thinking",
                    },
                    {
                      label: "fill in the blanks",
                      value: "fill in the blanks",
                    },
                    { label: "true or false", value: "true or false" },
                    {
                      label: "all of the above",
                      value:
                        "any of multiple choice, true or false, short answer, fill in the blanks, and/or open ended essay",
                    },
                  ]}
                />{" "}
                for a {studentDemographic} lesson on {topic}.
              </p>
              <Button
                className="ml-auto"
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

  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("user_id", session?.user.id);

  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session?.user.id)
    .single();

  const isActive = subscriptionData?.status === "active";
  const isPro =
    isActive &&
    subscriptionData?.price_id ===
      process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_PRO;
  const totalLessonCount = lessons?.length || 0;
  const monthLessonCount =
    lessons?.filter(
      (l) => new Date(l.created_at ?? "").getMonth() === new Date().getMonth()
    ).length || 0;

  const needsUpgrade =
    (!isActive && totalLessonCount > 5) || (isPro && monthLessonCount > 30);

  if (needsUpgrade)
    return {
      redirect: {
        destination: "/upgrade",
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
