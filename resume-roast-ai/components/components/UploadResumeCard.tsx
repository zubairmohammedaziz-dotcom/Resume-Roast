"use client";

import { UploadCloud } from "lucide-react";

export default function UploadResumeCard() {
  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Upload Resume
        </h2>

        <p className="mt-2 text-zinc-400">
          Upload your resume to receive ATS analysis, resume roast,
          job matches and AI recommendations.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 p-12 transition hover:border-orange-500 hover:bg-zinc-800">
        <UploadCloud className="mb-4 h-14 w-14 text-orange-400" />

        <h3 className="text-lg font-semibold text-white">
          Drag & Drop Resume
        </h3>

        <p className="mt-2 text-sm text-zinc-400">
          PDF or DOCX • Max 5MB
        </p>

        <span className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-bold text-black">
          Choose File
        </span>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
        />
      </label>
    </div>
  );
}