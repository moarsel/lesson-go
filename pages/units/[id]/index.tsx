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
  const content = lesson?.content as SectionTypes;
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
    <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-8 lg:col-start-3">
      <Head>
        <title>{lesson?.title} Lesson Plan | Lesson Robot</title>
      </Head>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="mb-2 text-4xl capitalize">{lesson?.title}</h1>
          <div className="text-xl text-gray-600">
            {lesson?.grade
              ?.map((g) => gradeValues.find((v) => v === g))
              .join(", ")}{" "}
            {lesson?.subject?.join(", ")}
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <Button onClick={() => setShareOpen(true)} className="print:hidden">
            <ShareIcon width={24} />
            Share lesson
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="print:hidden"
          >
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

      <div className="mt-8 prose prose-slate print:prose-sm">
        {Object.entries(content)?.map(([key, section], i) => (
          <div className="print:break-after-all ">
            <h2 className="capitalize">{key}</h2>
            <Editor content={section.content} readOnly key={i} />
          </div>
        ))}
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
