import { CheckIcon } from "@heroicons/react/20/solid";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";

import DropDown from "../../components/DropDown";
import FormField from "../../components/FormField";
import LoadingDots from "../../components/LoadingDots";
import MainLayout from "../../components/MainLayout";
import ResizablePanel from "../../components/ResizablePanel";
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

let grades: GradeType[] = [
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
  "Post secondary",
  "Adult education",
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

let subjects: SubjectType[] = [
  "English language arts",
  "Math",
  "Science",
  "Arts",
  "History",
  "Geography",
  "Social and emotional learning",
  "Social studies",
  "Special education",
  "English as a second language",
  "Other",
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
  const [grade, setGrade] = useState<GradeType>("Grade 4");
  const [subject, setSubject] = useState<SubjectType>("Math");
  const [generatedActivities, setGeneratedActivities] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [localData, setLocalData] = useLocalStorage({});
  const router = useRouter();

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

  const activityPrompt = `Generate 3 lesson plan activity ideas for a ${grade} ${
    subject !== "Other" ? subject : ""
  } lesson with the goal of ${bio}, labelled "1.", "2.", or "3.". Make sure they are age appropriate, specific, and engaging like an expert teacher influencer would think of. Each generated activity is at max 30 words.`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedActivities("");
    setLoading(true);

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

    setLoading(false);
  };

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
      objectives: `List what a teacher needs to cover to prepare ${grade} ${subject} for ${selectedActivity}. Suggest a few specific concepts and phrase them as grade appropriate learning objectives students should meet, and use less than 70 words.`,
      instructions: `Create a detailed plan for how a teacher will do a class Warmup (how to get the class engaged in the topic - 60 words max) and Direct Instruction (what specific concepts to cover, then how to model the activity for students). It should be appropriate for a ${grade} ${subject} class activity: ${selectedActivity}.`, // that meets learning goals: ${sections.objectives.content}
      practice: `Detail the plan for ${grade} ${subject} students doing the guided practice part of this activity: ${selectedActivity}. It should that meet learning goals: ${sections.objectives.content}.  In the style of a creative veteran teacher passive voice.`,
      differentiation: `Make a list of bullet points examples of how to differentiate this activity: ${selectedActivity} for ${grade} students with differing needs. In the style of a creative veteran teacher but in a passive voice.`,
      materials: `Make a list of bullet points with the specific materials needed in this lesson: ${sections.practice.content}. Return markdown bullet points only no headings.`,
    };

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

    setLoading(false);
  }

  async function saveContent() {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        user_id: user?.id,
        title: bio,
        subject: subject,
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
    <div className="w-full max-w-xl mx-auto mt-10">
      <h1 className="mx-auto mb-6 text-3xl font-bold sm:text-4xl text-slate-900">
        First, who is this for?
      </h1>
      <div className="flex flex-row space-x-8">
        <FormField label="Grade:" className="w-full">
          <DropDown
            value={grade}
            values={grades}
            setValue={(grade) => setGrade(grade)}
          />
        </FormField>

        <FormField label="Subject:" className="w-full">
          <DropDown
            value={subject}
            values={subjects}
            setValue={(subject) => setSubject(subject)}
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
          placeholder={"Plant anatomy"}
        />
      </FormField>

      {!loading && (
        <button
          className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
          onClick={(e) => generateBio(e)}
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
                <div>
                  <h2 className="mx-auto text-3xl font-bold sm:text-4xl text-slate-900">
                    Great, how about we try one of these activities?
                  </h2>
                </div>
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-8">
                  {generatedActivities
                    .split(/\n(?=[0-9]\.)/)
                    .map((activity) => activity.replace(/([0-9]\.)/, "").trim())
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
        <div className="">
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
                        {sectionData.content ? <CheckIcon color="white" /> : ""}
                      </span>
                    </div>
                  </button>
                  {sectionData.content && (
                    <textarea
                      value={sectionData.content}
                      aria-label={sectionName}
                      onChange={(e) =>
                        setSectionContent(
                          sectionName as keyof SectionTypes,
                          e.target.value
                        )
                      }
                      rows={6}
                      style={{ minHeight: "4rem" }}
                      className="w-full p-6 mb-[-6px] border-transparent border-t-slate-200  rounded-b-xl focus:border-green-700 focus:ring-green-700 focus:ring-inset"
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
  return <MainLayout>{page}</MainLayout>;
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
      user: session.user,
    },
  };
};
