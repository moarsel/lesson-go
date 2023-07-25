// new component
import Link from "next/link";
import React from "react";
import { gradeValues, subjectTypes } from "../pages/lessons/new";

export default function Categories() {
  return (
    <div className="flex gap-8 mt-24 sm:flex-row">
      <div>
        <p className="text-sm text-gray-500">Lesson Plans by Subject</p>
        <div className="flex flex-col gap-2 mt-1">
          {subjectTypes.map((v) => (
            <Link href={`/subject/${v}`}>{v}</Link>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500">Lesson Plans by Grade</p>
        <div className="flex flex-col gap-2 mt-1">
          {gradeValues.map((v) => (
            <Link href={`/grade/${v}`}>{v}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
