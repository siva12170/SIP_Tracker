import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

export default function PublicDashboardLayout({
  children,
}) {
  return (
    <div className="relative flex min-h-screen w-full bg-[var(--bg)]">
      <Sidebar />
      <div className="flex flex-1 flex-col px-6 pb-10 pt-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <Topbar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
