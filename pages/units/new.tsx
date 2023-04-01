import { CheckIcon } from "@heroicons/react/20/solid";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import Autocomplete from "../../components/Autocomplete";
import Button from "../../components/Button";

import Editor from "../../components/Editor/Editor";
import FormField from "../../components/FormField";
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

export const stateValues = [
  "Alabama",
  "Alaska",
  "Alberta",
  "Arizona",
  "Arkansas",
  "British Columbia",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Manitoba",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Brunswick",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "Newfoundland and Labrador",
  "North Carolina",
  "North Dakota",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ohio",
  "Oklahoma",
  "Ontario",
  "Oregon",
  "Pennsylvania",
  "Prince Edward Island",
  "Quebec",
  "Rhode Island",
  "Saskatchewan",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "Yukon",
];

export type SectionData = {
  content: string;
  description: string;
  prompt: string;
};
export type SectionTypes = {
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
  const [bio, setBio] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [generatedActivities, setGeneratedActivities] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [localData, setLocalData] = useLocalStorage({});
  const router = useRouter();
  const activitiesRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const studentDemographic = `${grade} ${subject === "Other" ? "" : subject}`;
  const defaultContent = {
    plan: {
      prompt: `Create  ${studentDemographic} lesson plan that meets these goals: ${selectedActivity}. The plan should be formatted in markdown and only include sections for warmup, direct instruction, guided practice, and differentiation. Make it specific, realistic, concise, and practical.`,
      content: "",
      description: "",
    },
    assessment: {
      prompt: `My ${studentDemographic} students are doing this activity: ${selectedActivity}. Output an assessment to quiz their learning with a few different question formats, with white space for the students to write, and the answers should only be in an answer key at the end. Output should be in markdown format.`,
      content: "",
      description: "",
    },
  } as SectionTypes;

  const [sections, setSections] = useState<SectionTypes>(defaultContent);

  const activityPrompt = `List the main units for the ${studentDemographic} curriculum in ${location}, labelled "1.", "2.", or "3.". Make sure they are accurate and specific. Each generated standard should have a short description.`;

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

    const lessonPlanPrompt = {
      plan: `Create a ${studentDemographic} unit plan for a unit on ${selectedActivity}. The plan should be formatted in markdown with several lessons, each should have a heading and a single paragraph explanation of the concepts (specifically explain the key concepts at a ${grade} level in less than 200 words). Break it down into enough lessons to cover the whole unit.`,
      assessment: `My ${studentDemographic} students are doing this activity: ${selectedActivity}. After we've done this, I will use a quiz as a formative assessment of their learning. Output a quiz with a few different question formats, with whitespace for the students to write. The answers should only be in an answer key at the end. Output should be in markdown format and there should be no h1 title.`,
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
    console.log("done");
    setLoading(false);
  }

  function handleNextStep() {
    generateContent("plan");
    // generateContent("assessment");
  }

  async function saveContent() {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        user_id: user?.id,
        title: bio,
        overview: selectedActivity,
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
        First, who is this unit for?
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Autocomplete
          label="Grade:"
          className="w-full"
          value={""}
          onChange={(e) => setGrade(e)}
          items={gradeValues}
        />

        <Autocomplete
          label="Subject:"
          className="w-full"
          value={""}
          onChange={(e) => setSubject(e)}
          items={subjectTypes}
        />
      </div>

      <Autocomplete
        label="State/Province:"
        className="w-full"
        value={""}
        onChange={(e) => setLocation(e)}
        items={stateValues}
      />

      <Button
        loading={loading}
        onClick={(e) =>
          Boolean(subject.length && grade.length) && generateBio(e)
        }
        disabled={Boolean(!subject.length || !grade.length)}
      >
        {generatedActivities ? "Try one more time ↺" : "Suggest units →"}
      </Button>

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
                    So which unit should we focus on?
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
                  label="Selected Activity"
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
                  onClick={handleNextStep}
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
      {sections.plan.content && (
        <div ref={detailsRef}>
          <h2 className="mx-auto mb-8 text-3xl font-bold sm:text-4xl text-slate-900">
            Great, now let's fill this out a bit!
          </h2>

          <div className="flex flex-col w-full gap-4 mb-8">
            <Editor
              content={sections.plan.content}
              onChange={(value) => setSectionContent("plan", value)}
            />

            <Editor
              content={sections.assessment.content}
              onChange={(value) => setSectionContent("assessment", value)}
            />
          </div>
        </div>
      )}

      {sections.assessment.content && (
        <>
          <Button
            loading={loading}
            onClick={saveContent}
            className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
          >
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
        <title>Create a lesson | Lesson Robot</title>
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
