import {
  GlobeAltIcon,
  LockClosedIcon,
  PrinterIcon,
  ShareIcon,
} from "@heroicons/react/20/solid";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { ReactElement, useState } from "react";
import Button from "../../../components/Button";
import Editor from "../../../components/Editor/Editor";
import LinkButton from "../../../components/LinkButton";
import MainLayout from "../../../components/MainLayout";
import Modal from "../../../components/Modal";
import { Database } from "../../../supabase/database.types";
import { Lesson } from "../../../utils/types";
import { gradeValues, SectionTypes } from "../new";

function ViewLessonPage({
  lesson,
  currentUserId,
}: {
  lesson: Lesson;
  currentUserId?: string;
}) {
  if (!lesson) throw Error("Not authorized");
  const supabase = useSupabaseClient();
  const { activity, plan, resource, assessment } = lesson.content as {
    activity: { content: string };
    plan: { content: string };
    resource: { content: string };
    assessment: { content: string };
  };

  const isCurrentUser = lesson.user_id === currentUserId;
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
      `https://twitter.com/share?text=I%20just%20published%20%22${title}%22%20on%20Lesson%20Robot!%20${url}`,
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
    <div
      itemScope
      itemType="http://schema.org/CreativeWork"
      className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3"
    >
      <Head>
        <title>{lesson?.title} Lesson Plan | Lesson Robot</title>
        <meta
          name="description"
          content={
            activity.content + " | Lesson plan idea, handout, and assessment."
          }
        />
        <meta itemProp="learningResourceType" content="Lesson Plan" />
        <meta itemProp="timeRequired" content="PT1H" />
        <meta itemProp="educationalLevel" content={lesson.grade[0]} />
        <meta itemProp="inLanguage" content="en" />
      </Head>
      <div className="flex flex-col gap-4">
        <div>
          <h1 itemProp="name" className="mb-2 text-4xl capitalize print:hidden">
            {lesson?.title}
          </h1>
          <div
            itemProp="description"
            className="mt-1 mb-2 text-xl text-gray-700 print:hidden"
          >
            {activity.content}
          </div>
          <div className="text-xl text-gray-500 print:hidden">
            {lesson?.grade
              ?.map((g) => gradeValues.find((v) => v === g))
              .join(", ")}{" "}
            {lesson?.subject?.join(", ")}
          </div>
        </div>
        <div className="flex flex-row gap-3 print:hidden">
          <Button onClick={() => setShareOpen(true)}>
            <ShareIcon width={24} />
            Share lesson
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <PrinterIcon width={24} />
            Print
          </Button>
        </div>

        <Modal
          title="Share"
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        >
          <div className="flex flex-col mt-8 gap-y-4">
            {isCurrentUser && !isPublic && (
              <div className="flex flex-row gap-2 text-lg">
                Publish your lesson to share it with others!
              </div>
            )}
            {isCurrentUser && (
              <Button onClick={handleTogglePublish}>
                {!isPublic ? (
                  <GlobeAltIcon width={24} />
                ) : (
                  <LockClosedIcon width={24} />
                )}
                {!isPublic ? "Publish" : "Make private"}
              </Button>
            )}

            {isPublic && (
              <>
                <p className="mb-2">Share via:</p>
                <div className="flex flex-row gap-2">
                  <LinkButton
                    variant="outline"
                    target="_blank"
                    href={shareLinks.email(currentUrl, lesson?.title || "")}
                  >
                    Email
                  </LinkButton>
                  <LinkButton
                    variant="outline"
                    target="_blank"
                    href={shareLinks.facebook(currentUrl, lesson?.title || "")}
                  >
                    Facebook
                  </LinkButton>
                  <LinkButton
                    variant="outline"
                    target="_blank"
                    href={shareLinks.twitter(currentUrl, lesson?.title || "")}
                  >
                    Twitter
                  </LinkButton>
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
      <div
        itemProp="hasPart"
        itemScope
        itemType="http://schema.org/CreativeWork"
      >
        <h2
          itemProp="learningResourceType"
          className="mt-16 text-lg font-medium capitalize print:mt-0 text-slate-700 print:hidden"
        >
          Lesson Plan
        </h2>

        <div className="p-12 mt-4 mb-16 prose border shadow-xl print:p-0 print:my-0 break-after-page rounded-xl print:shadow-none print:border-none prose-slate print:prose-sm border-slate-100">
          <Editor content={plan.content} readOnly />
        </div>
      </div>
      {resource.content && (
        <div
          itemProp="hasPart"
          itemScope
          itemType="http://schema.org/CreativeWork"
        >
          <h2
            itemProp="learningResourceType"
            className="mt-16 text-lg font-medium capitalize print:my-0 text-slate-700 print:hidden"
          >
            Printable resource
          </h2>
          <div className="p-12 mt-4 mb-16 prose border shadow-xl print:p-0 print:my-0 break-after-page rounded-xl print:shadow-none print:border-none prose-slate print:prose-sm border-slate-100">
            <Editor content={resource.content} readOnly />
          </div>
        </div>
      )}
      {assessment.content && (
        <div
          itemProp="hasPart"
          itemScope
          itemType="http://schema.org/CreativeWork"
        >
          <h2
            itemProp="learningResourceType"
            className="mt-16 text-lg font-medium capitalize print:my-0 text-slate-700 print:hidden"
          >
            Assessment
          </h2>
          <div className="p-12 mt-4 mb-16 prose border shadow-xl print:p-0 print:mt-0 rounded-xl print:shadow-none print:border-none prose-slate print:prose-sm border-slate-100">
            <Editor content={assessment.content} readOnly />
          </div>
        </div>
      )}
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
  let userId;
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch (e) {}

  // Check if we have a session
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", ctx.params?.id)
    .single();

  return {
    props: {
      lesson: data,
      currentUserId: userId || null,
    },
  };
};
