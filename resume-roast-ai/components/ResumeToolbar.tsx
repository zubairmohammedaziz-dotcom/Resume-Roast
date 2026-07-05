type Props = {
  onDownloadResume: () => void;
  onCopySummary: () => void;
  onPrintResume: () => void;
  onDownloadCoverLetter?: () => void;
  hasCoverLetter: boolean;
};

export default function ResumeToolbar({
  onDownloadResume,
  onCopySummary,
  onPrintResume,
  onDownloadCoverLetter,
  hasCoverLetter,
}: Props) {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <button
        onClick={onDownloadResume}
        className="rounded-xl bg-green-500 px-6 py-3 font-bold text-black"
      >
        ⬇ Download PDF
      </button>

      <button
        onClick={onCopySummary}
        className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-white"
      >
        📋 Copy Summary
      </button>

      <button
        onClick={onPrintResume}
        className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-white"
      >
        🖨 Print Resume
      </button>

      {hasCoverLetter && onDownloadCoverLetter && (
        <button
          onClick={onDownloadCoverLetter}
          className="rounded-xl border border-zinc-700 px-6 py-3 font-bold text-white"
        >
          📄 Download Cover Letter
        </button>
      )}
    </div>
  );
}