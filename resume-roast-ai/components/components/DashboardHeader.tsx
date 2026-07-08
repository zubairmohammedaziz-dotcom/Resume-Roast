import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <DashboardHeader />
      </div>
    </main>
  );
}