import DashboardLayout from "../../components/components/DashboardLayout";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-white p-4">Before Layout</h1>
      <DashboardLayout />
      <h1 className="text-white p-4">After Layout</h1>
    </>
  );
}