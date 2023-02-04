import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import FormField from "../components/FormField";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

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

  // This data is a ReadableStream
  const data = response.body;
  if (!data) {
    return Promise.reject();
  }
  return Promise.resolve(data);
}

type ContentTypes = {
  directInstruction: string;
  materials: string;
};
const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [grade, setGrade] = useState<GradeType>("Grade 4");
  const [subject, setSubject] = useState<SubjectType>("Math");
  const [generatedActivities, setGeneratedActivities] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<ContentTypes>({
    directInstruction: "",
    materials: "",
  });

  const prompt = `Generate 3 lesson plan activity ideas for a ${grade} ${
    subject !== "Other" ? subject : ""
  } lesson with the goal of ${bio}, labelled "1.", "2.", or "3.". Make sure they are age appropriate, specific, and engaging like an expert teacher influencer would think of. Each generated activity is at max 30 words.`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedActivities("");
    setLoading(true);

    const data = await generateFromPrompt(prompt);
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

  async function generateContent(type: keyof ContentTypes) {
    const prompts: ContentTypes = {
      directInstruction: "Create a direct instruction",
      materials: "other",
    };

    setGeneratedContent({ ...generatedContent, [type]: "" });
    setLoading(true);

    const data = await generateFromPrompt(prompts[type]);
    if (data) {
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setGeneratedContent((prev) => ({
          ...prev,
          [type]: prev[type] + chunkValue,
        }));
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-5xl min-h-screen py-2 mx-auto">
      <Head>
        <title>Lesson Go!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 mt-12 text-center sm:mt-20">
        <h1 className="max-w-2xl text-3xl font-bold sm:text-5xl text-slate-900">
          Create a perfect lesson plan with superhuman speed.
        </h1>
        <p className="mt-5 text-lg text-slate-700">
          Finish your lesson plan before your coffee? Let's go!
        </p>
        <div className="w-full max-w-xl mt-10">
          <div className="flex flex-row space-x-8">
            <FormField label="Grade:">
              <DropDown
                value={grade}
                values={grades}
                setValue={(grade) => setGrade(grade)}
              />
            </FormField>

            <FormField label="Subject:">
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
              className="w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              placeholder={"Plant anatomy"}
            />
          </FormField>

          {!loading && (
            <button
              className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
              onClick={(e) => generateBio(e)}
            >
              Suggest activities &rarr;
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

          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
          <ResizablePanel>
            <AnimatePresence mode="wait">
              <motion.div className="my-10 space-y-10">
                {generatedActivities && (
                  <>
                    <div>
                      <h2 className="mx-auto text-3xl font-bold sm:text-4xl text-slate-900">
                        Suggestions:
                      </h2>
                    </div>
                    <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-8">
                      {generatedActivities
                        .split(/\n(?=[0-9]\.)/)
                        .map((activity) =>
                          activity.replace(/\n(?=[0-9]\.)/, "").trim()
                        )
                        .map((activity) => {
                          return (
                            <button
                              className={`p-4 transition border shadow-md rounded-xl ${
                                activity === selectedActivity
                                  ? "bg-green-700 hover:bg-green-900 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                setSelectedActivity(`${activity}`);
                                // toast("Idea copied to clipboard", {
                                //   icon: "✂️",
                                // });
                              }}
                              key={activity}
                            >
                              <p>{activity}</p>
                            </button>
                          );
                        })}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </ResizablePanel>
          {selectedActivity && (
            <div className="">
              <FormField label="Activity:">
                <textarea
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  rows={3}
                  className="w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
                />
              </FormField>
              {/* <FormField
                label="Direct Instruction:"
                description="What knowledge should the teacher introduce and model?"
              >
                <textarea
                  value={generatedContent['directInstruction']}
                  onChange={(e) => setGeneratedContent({...generatedContent, 'directInstruction': e.target.value})}
                  rows={3}
                  style={{ minHeight: "4rem" }}
                  className="w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
                />
                <button
                  onClick={()=>generateContent('directInstruction')}
                  aria-label="Suggest direct instruction content"
                  className="absolute px-3 py-2 text-white rounded-full right-2 bottom-4 bg-slate-700 hover:bg-green-700"
                >
                  Suggest
                </button>
              </FormField> */}

              <fieldset>
                <legend>Include</legend>
                <input name="include" value="Direct Instruction" />
                <input name="include" value="Warmup" />
                <input name="include" value="Guided practice" />
                <input name="include" value="Independent practice" />
                <input name="include" value="Differentiation" />
                <input name="include" value="Materials" />
                <input name="include" value="Reflection" />
              </fieldset>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
