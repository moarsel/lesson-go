import {
  GlobeAltIcon,
  InboxIcon,
  LockClosedIcon,
  PrinterIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { ReactElement, useState } from "react";
import Button from "../../../components/Button";
import LinkButton from "../../../components/LinkButton";
import MainLayout from "../../../components/MainLayout";
import Modal from "../../../components/Modal";
import { Database } from "../../../supabase/database.types";
import { Lesson } from "../../../utils/types";
import { gradeValues, SectionTypes } from "../new";

function ViewLessonPage({ lesson }: { lesson: Lesson }) {
  if (!lesson) throw Error("Not authorized");
  const supabase = useSupabaseClient();
  const content = lesson?.content as SectionTypes;
  const [shareOpen, setShareOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(lesson.public);
  async function handleTogglePublish() {
    const { data, error } = await supabase
      .from("lessons")
      .update({ public: !isPublic })
      .eq("id", lesson.id)
      .select("public")
      .single();
    if (data) {
      setIsPublic(data?.public);
    } else {
      console.warn(error);
    }
  }

  const shareLinks = {
    facebook: (url: string, title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}"`,
    twitter: (url: string, title: string) =>
      `https://twitter.com/share?text=I%20just%20published%20%22${title}%22%20on%20Lesson%20Go!%20${url}`,
    email: (url: string, title: string) =>
      `mailto:?&subject=I published my lesson &body=I%20just%20published%20a%20lesson%20%22${title}%22%20at%20${url}.`,
  };

  let currentUrl = "";
  if (typeof window !== "undefined") {
    currentUrl = window.location.href;
  }

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      const urlField = window?.document.getElementById("book-url-field");
      // @ts-ignore
      if (urlField?.value) {
        navigator.clipboard
          // @ts-ignore
          .writeText(urlField.value);
      }
    }
  };

  return (
    <div className="max-w-4xl px-6 mx-auto">
      <Head>
        <title>{lesson?.title} Lesson Plan | Lesson Go</title>
      </Head>
      <div className="flex flex-row items-center">
        <h1 className="mb-3 text-4xl capitalize">{lesson?.title}</h1>
        <Button
          onClick={() => setShareOpen(true)}
          className="ml-auto  print:hidden"
        >
          <ShareIcon width={24} />
          Share lesson
        </Button>
        <Modal
          title="Share"
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        >
          <div className="flex flex-col mt-8 gap-y-5">
            <Button onClick={() => window.print()}>
              <PrinterIcon width={24} />
              Print lesson plan
            </Button>
            <Button onClick={handleTogglePublish}>
              {!isPublic ? (
                <GlobeAltIcon width={24} />
              ) : (
                <LockClosedIcon width={24} />
              )}
              {!isPublic ? "Publish" : "Make private"}
            </Button>

            {isPublic && (
              <>
                <LinkButton
                  variant="outline"
                  target="_blank"
                  href={shareLinks.email(currentUrl, lesson?.title || "")}
                >
                  <InboxIcon width={24} />
                  Email lesson
                </LinkButton>
                <LinkButton
                  variant="outline"
                  target="_blank"
                  href={shareLinks.facebook(currentUrl, lesson?.title || "")}
                >
                  Share on Facebook
                </LinkButton>
                <LinkButton
                  variant="outline"
                  target="_blank"
                  href={shareLinks.twitter(currentUrl, lesson?.title || "")}
                >
                  Share on Twitter
                </LinkButton>
              </>
            )}
          </div>
        </Modal>
      </div>
      <div className="text-xl text-gray-600">
        {lesson?.grade
          ?.map((g) => gradeValues.find((v) => v.value === g)?.label)
          .join(", ")}{" "}
        {lesson?.subject?.join(", ")}
      </div>
      <div className="mt-8 prose prose-slate">
        <h2 className="">Learning Objectives</h2>
        <div className="">
          {content?.objectives?.content.split("\n").map((c) => (
            <p>{c}</p>
          ))}
        </div>

        {content?.materials && (
          <>
            <h2 className="">Materials</h2>
            <div className="">
              {content?.materials?.content.split("\n").map((c) => (
                <p>{c}</p>
              ))}
            </div>
          </>
        )}
        {content?.instructions && (
          <>
            <h2 className="">Direct Instruction</h2>
            <div className="">
              {content?.instructions?.content.split("\n").map((c) => (
                <p>{c}</p>
              ))}
            </div>
          </>
        )}
        {content?.practice && (
          <>
            <h2 className="">Guided Practice</h2>
            <div className="">
              {content?.practice?.content.split("\n").map((c) => (
                <p>{c}</p>
              ))}
            </div>
          </>
        )}
        {content?.differentiation && (
          <>
            <h2 className="">Differentiation</h2>
            <div className="">
              {content?.differentiation?.content.split("\n").map((c) => (
                <p>{c}</p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default ViewLessonPage;

ViewLessonPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

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
