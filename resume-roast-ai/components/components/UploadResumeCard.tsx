"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

type Props = {
  selectedFile?: File | null;
  loading?: boolean;
  status?: string;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  onAnalyze?: () => void;
};

export default function UploadResumeCard({
  selectedFile: controlledFile,
  loading = false,
  status = "",
  onFileSelect,
  onRemove,
  onAnalyze,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  const selectedFile = controlledFile ?? localFile;
  const message = status || localMessage;

  function acceptFile(file?: File) {
    if (!file) return;

    const validExtensions = [".pdf", ".doc", ".docx"];
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    if (!validExtensions.includes(extension)) {
      setLocalMessage("Upload a PDF, DOC or DOCX file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalMessage("The file must be smaller than 5 MB.");
      return;
    }

    setLocalMessage("");

    if (onFileSelect) {
      onFileSelect(file);
    } else {
      setLocalFile(file);
    }
  }

  function removeFile() {
    if (onRemove) {
      onRemove();
    } else {
      setLocalFile(null);
    }

    setLocalMessage("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101010] shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
      <div className="border-b border-white/10 px-6 py-6 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-400">
          Start your analysis
        </p>

        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Upload your resume
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Receive an ATS score, recruiter feedback, job matches and a
              targeted resume from one upload.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <ShieldIcon />
            Your document is processed securely
          </div>
        </div>
      </div>

      <div className="p-5 md:p-8">
        {!selectedFile ? (
          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              acceptFile(event.dataTransfer.files?.[0]);
            }}
            className={`relative flex min-h-[300px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed px-6 text-center transition ${
              dragging
                ? "border-orange-500 bg-orange-500/[0.06]"
                : "border-zinc-700 bg-black/25 hover:border-zinc-500 hover:bg-black/40"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#151515] text-orange-400 shadow-inner">
              <UploadCloud
                className="h-6 w-6"
                strokeWidth={1.7}
              />
            </div>

            <h3 className="mt-6 text-lg font-semibold text-white">
              Drop your resume here
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              or browse files from your device
            </p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#101010]"
            >
              Choose file
            </button>

            <p className="mt-5 text-xs text-zinc-700">
              PDF, DOC or DOCX · Maximum 5 MB
            </p>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="sr-only"
              onChange={(event) => {
                acceptFile(event.target.files?.[0]);
              }}
            />
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/[0.04] p-5 md:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <FileText
                    className="h-5 w-5"
                    strokeWidth={1.7}
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {formatFileSize(selectedFile.size)} · Ready to analyze
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={removeFile}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <ProcessItem number="01" label="Resume extraction" />
              <ProcessItem number="02" label="ATS evaluation" />
              <ProcessItem number="03" label="Career matching" />
            </div>

            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading || !onAnalyze}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#101010] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Analyzing resume
                </>
              ) : (
                <>
                  Analyze resume
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-400">
            {message}
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <BenefitItem
            title="ATS score"
            description="See how your resume performs"
          />

          <BenefitItem
            title="Job matches"
            description="Discover relevant opportunities"
          />

          <BenefitItem
            title="Targeted rewrite"
            description="Prepare a stronger application"
          />
        </div>
      </div>
    </section>
  );
}

function ProcessItem({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-400">
        {number}
      </p>

      <p className="mt-1 text-xs font-medium text-zinc-400">
        {label}
      </p>
    </div>
  );
}

function BenefitItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

      <div>
        <p className="text-xs font-medium text-zinc-300">{title}</p>

        <p className="mt-1 text-[11px] leading-5 text-zinc-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}