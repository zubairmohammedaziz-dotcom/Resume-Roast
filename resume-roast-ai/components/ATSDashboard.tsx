type Props = {
  score: number;
  keywordCount: number;
};

export default function ATSDashboard({ score, keywordCount }: Props) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl border border-green-500 bg-green-500/10 p-6 text-center">
        <p className="text-zinc-300">ATS Score</p>
        <p className="mt-3 text-5xl font-black text-green-400">{score}</p>
      </div>

      <div className="rounded-2xl border border-orange-500 bg-orange-500/10 p-6 text-center">
        <p className="text-zinc-300">Keywords Added</p>
        <p className="mt-3 text-5xl font-black text-orange-400">
          {keywordCount}
        </p>
      </div>

      <div className="rounded-2xl border border-cyan-500 bg-cyan-500/10 p-6 text-center">
        <p className="text-zinc-300">Resume Ready</p>
        <p className="mt-3 text-4xl font-black text-cyan-400">YES</p>
      </div>
    </div>
  );
}