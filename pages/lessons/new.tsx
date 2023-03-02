import { CheckIcon } from "@heroicons/react/20/solid";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";

import DropDown from "../../components/DropDown";
import FormField from "../../components/FormField";
import LoadingDots from "../../components/LoadingDots";
import MainLayout from "../../components/MainLayout";
import ResizablePanel from "../../components/ResizablePanel";
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
  { value: 4, label: "Pre-K" },
  { value: 5, label: "Kindergarten" },
  { value: 6, label: "Grade 1" },
  { value: 7, label: "Grade 2" },
  { value: 8, label: "Grade 3" },
  { value: 9, label: "Grade 4" },
  { value: 10, label: "Grade 5" },
  { value: 11, label: "Grade 6" },
  { value: 12, label: "Grade 7" },
  { value: 13, label: "Grade 8" },
  { value: 14, label: "Grade 9" },
  { value: 15, label: "Grade 10" },
  { value: 16, label: "Grade 11" },
  { value: 17, label: "Grade 12" },
  { value: 18, label: "Adult education" },
  { value: 19, label: "Post secondary" },
  { value: 0, label: "All ages" },
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

type SubjectOptions = { label: SubjectType; value: SubjectType };

export const subjectTypes: Array<SubjectOptions> = [
  { label: "Arts", value: "Arts" },
  { label: "English language arts", value: "English language arts" },
  {
    label: "English as a second language",
    value: "English as a second language",
  },
  { label: "Geography", value: "Geography" },
  { label: "History", value: "History" },
  { label: "Math", value: "Math" },
  { label: "Science", value: "Science" },
  {
    label: "Social and emotional learning",
    value: "Social and emotional learning",
  },
  { label: "Social studies", value: "Social studies" },
  { label: "Special education", value: "Special education" },
  { label: "Other", value: "Other" },
];

export type SectionData = {
  content: string;
  description: string;
};
export type SectionTypes = {
  objectives: SectionData;
  instructions: SectionData;
  practice: SectionData;
  differentiation: SectionData;
  materials: SectionData;
};

async function generateFromPrompt(prompt: string): Promise<ReadableStream> {
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
  const [bio, setBio] = useState("");
  const [grade, setGrade] = useState<Array<{ value: number; label: string }>>([
    { value: 0, label: "All ages" },
  ]);
  const [subject, setSubject] = useState<
    Array<{ label: SubjectType; value: SubjectType }>
  >([{ value: "Math", label: "Math" }]);
  const [generatedActivities, setGeneratedActivities] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [localData, setLocalData] = useLocalStorage({});
  const router = useRouter();
  const activitiesRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const [sections, setSections] = useState<SectionTypes>({
    objectives: {
      content: "",
      description:
        "Starting with learning goals helps robots (and humans) work backwards to make a lesson that meets our end goals.",
    },
    instructions: {
      content: "",
      description:
        "Direct instruction on what concepts to explain, and how to model the activity.",
    },
    practice: {
      content: "",
      description:
        "How students will practice the skills and get guided with feedback.",
    },
    differentiation: {
      content: "",
      description:
        "Ideas for modifying the activity for a wider range of student needs.",
    },
    materials: {
      content: "",
      description: "What do we need to make sure we have ahead of time.",
    },
  });

  const studentDemographic = `${grade
    .map((g) => g.label)
    .join(" and ")} ${subject
    .map((s) => (s.label !== "Other" ? s.label : ""))
    .filter(Boolean)
    .join(" and ")}`;

  const activityPrompt = `Generate 3 lesson plan activity ideas for ${studentDemographic} lesson with on the topic of ${bio}, labelled "1.", "2.", or "3.". Make sure they are age appropriate, specific, engaging and practical for a single lesson. Each generated activity is at max 35 words.`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedActivities("");
    setLoading(true);

    try {
      const data = await generateFromPrompt(activityPrompt);
      if (data) {
        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          setGeneratedActivities((prev) => prev + chunkValue);
        }
      }
    } catch (e) {
      console.warn(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      if (activitiesRef.current) {
        activitiesRef.current.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    }, 1500);
  }, [Boolean(generatedActivities)]);

  useEffect(() => {
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    }, 1500);
  }, [Boolean(sections.objectives.content)]);

  function setSectionContent(type: keyof SectionTypes, contentValue: string) {
    setSections({
      ...sections,
      [type]: { ...sections[type], content: contentValue },
    });
  }

  async function generateContent(type: keyof SectionTypes) {
    setSectionContent(type, "");
    setLoading(true);

    const lessonPlanPrompt = {
      objectives: `List the main learning objectives ${studentDemographic} for ${selectedActivity}. Summarize a few specific concepts as learning objectives students should meet, and use less than 50 words in point form.`,
      instructions: `Create a detailed plan for how a teacher will do a class Warmup (how to get the class engaged in the topic - 60 words max) and Direct Instruction (summarize key concepts for ${studentDemographic}, and then instructions for how to model the activity for students). Only include the setup not the activity itself. It should be appropriate for a ${studentDemographic} class activity: ${selectedActivity}.`, // that meets learning goals: ${sections.objectives.content}
      practice: `Detail the plan for the guided practice part of this activity: ${selectedActivity} for ${studentDemographic} students. The plan should be step by step and specific, naturally incorporating formative assessment for these learning goals ${sections.objectives.content}. Don't explicitly mention learning goals or formative assessment. List steps in a passive voice and keep it under 150 words.`,
      differentiation: `Make a list less than 6 bullet points examples of how to differentiate this activity: ${selectedActivity} for ${studentDemographic} students with differing needs or background. Written in passive voice of a passionate teacher.`,
      materials: `Make a list of specific materials needed in this lesson: ${sections.practice.content}. Return markdown bullet points only and no headings, 30 words at most, but could be as few as 2 bullet points.`,
    };

    try {
      const data = await generateFromPrompt(lessonPlanPrompt[type]);

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
    setLoading(false);
  }

  async function saveContent() {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        user_id: user?.id,
        title: bio,
        overview: selectedActivity,
        subject: subject.map((subject) => subject.value),
        grade: grade.map((grade) => grade.value),
        content: sections,
      })
      .select("id")
      .single();

    if (data && data.id) {
      // setLocalData({
      //   [data.id]: {
      //     user_id: user?.id,
      //     title: bio,
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
    <div className="col-span-12 mt-10 sm:col-span-8 sm:col-start-2 lg:col-span-6 lg:col-start-3">
      <h1 className="mb-6 text-3xl font-bold sm:text-4xl text-slate-900">
        First, who is this lesson for?
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row">
        <FormField label="Grade:" className="w-full">
          <DropDown
            value={grade}
            values={gradeValues}
            setValue={(r: Array<{ label: string; value: number }>) =>
              setGrade(r)
            }
          />
        </FormField>

        <FormField label="Subject:" className="w-full">
          <DropDown
            value={subject}
            values={subjectTypes}
            setValue={(subject: Array<SubjectOptions>) => setSubject(subject)}
          />
        </FormField>
      </div>

      <FormField
        label="Topic:"
        description="What's your lesson about?"
        className="mt-5"
      >
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={2}
          className="w-full mt-2 border-gray-300 rounded-md shadow-sm form-input focus:border-black focus:ring-black"
          placeholder={"e.g. Fractions in everyday life"}
        />
      </FormField>

      {!loading && (
        <button
          className={`w-full md:w-80 px-4 py-2 mt-8 font-medium text-white rounded-xl sm:mt-10 hover:bg-black/80 ${
            Boolean(subject.length && grade.length)
              ? "bg-black "
              : "bg-neutral-500 cursor-not-allowed"
          }`}
          onClick={(e) =>
            Boolean(subject.length && grade.length) && generateBio(e)
          }
          disabled={Boolean(!subject.length || !grade.length)}
        >
          {generatedActivities ? "Try one more time ↺" : "Suggest activities →"}
        </button>
      )}
      {loading && (
        <button
          className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
          disabled
        >
          <LoadingDots color="white" style="large" />
        </button>
      )}
      {generatedActivities && (
        <hr className="h-px my-10 bg-gray-700 border-1 dark:bg-gray-700" />
      )}
      <ResizablePanel>
        <AnimatePresence mode="wait">
          <motion.div className="my-8 space-y-10">
            {generatedActivities && (
              <>
                <div ref={activitiesRef}>
                  <h2
                    id="activities"
                    className="mx-auto mb-8 text-3xl font-bold sm:text-4xl text-slate-900"
                  >
                    Great, how about we try one of these activities?
                  </h2>

                  <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-8">
                    {generatedActivities
                      .split(/\n(?=[0-9]\.)/)
                      .map((activity) =>
                        activity.replace(/([0-9]\.)/, "").trim()
                      )
                      .map((activity, i) => {
                        return (
                          <button
                            className={`p-4 transition border shadow-md rounded-xl ${
                              activity === selectedActivity
                                ? "bg-green-700 hover:bg-green-900 text-white"
                                : "bg-white hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setSelectedActivity(`${activity}`);
                            }}
                            key={activity}
                          >
                            <p className="flex items-center gap-5 text-left">
                              <span className="flex items-center justify-center w-8 h-8 text-lg text-white bg-green-900 rounded-full shrink-0">
                                {i + 1}
                              </span>
                              {activity}
                            </p>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
            {selectedActivity && (
              <>
                <FormField
                  label="Selected Activity:"
                  description="Feel free to tweak this your needs."
                >
                  <textarea
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    rows={3}
                    className="w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
                  />
                </FormField>
                <button
                  onClick={() => generateContent("objectives")}
                  className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
                >
                  Next step
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </ResizablePanel>
      <hr className="h-px my-10 bg-gray-700 border-1 dark:bg-gray-700" />
      {sections.objectives.content && (
        <div ref={detailsRef}>
          <h2 className="mx-auto mb-8 text-3xl font-bold sm:text-4xl text-slate-900">
            Great, now let's finish the lesson plan!
          </h2>

          <div className="flex flex-col w-full gap-4 mb-8">
            {Object.entries(sections).map(([sectionName, sectionData]) => {
              return (
                <div className="transition border shadow-md rounded-xl">
                  <button
                    disabled={
                      sectionName === "objectives" ||
                      Boolean(sectionData.content)
                    }
                    aria-pressed={Boolean(sectionData.content)}
                    aria-label={"include " + sectionName}
                    className={`p-6 text-left w-full  flex flex-col bg-white rounded-xl ${
                      Boolean(sectionData.content)
                        ? "rounded-t-xl"
                        : " rounded-xl hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      !sectionData.content &&
                      generateContent(sectionName as keyof SectionTypes)
                    }
                    key={sectionName}
                  >
                    <div className="flex flex-row items-center w-full gap-5">
                      <div className="flex flex-col">
                        <div className="text-lg font-bold capitalize">
                          {sectionName}
                        </div>{" "}
                        <div className="text-sm">{sectionData.description}</div>
                      </div>
                      <span
                        className={`ml-auto flex items-center justify-center w-8 h-8 text-lg  rounded-full shrink-0 border-2 ${
                          !sectionData.content
                            ? "border-black bg-white"
                            : "border-green-700 bg-green-700"
                        }`}
                      >
                        {sectionData.content ? (
                          <CheckIcon
                            className="font-bold w-7 h-7"
                            color="white"
                          />
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </button>
                  {sectionData.content && (
                    <Textarea
                      value={sectionData.content}
                      aria-label={sectionName}
                      onChange={(e) =>
                        setSectionContent(
                          sectionName as keyof SectionTypes,
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sections.objectives.content && loading && (
        <button
          className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
          disabled
        >
          <LoadingDots color="white" style="large" />
        </button>
      )}
      {!loading && sections.objectives.content && (
        <>
          <button
            onClick={saveContent}
            className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
          >
            Create lesson plan!
          </button>
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
        <title>Create a lesson | Lesson Go AI</title>
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
