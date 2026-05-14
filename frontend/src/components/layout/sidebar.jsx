"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboardLine,
  RiFundsBoxLine,
  RiTeamLine,
  RiExchangeFundsLine,
  RiSettingsLine,
  RiLogoutBoxLine,
} from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials } from "@/store/slices/auth-slice";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "", label: "Dashboard", icon: RiDashboardLine },
  { path: "investors", label: "Investors", icon: RiTeamLine },
  { path: "funds", label: "Funds", icon: RiFundsBoxLine },
  { path: "sips", label: "SIPs", icon: RiExchangeFundsLine },
];

const teamItems = [
  { label: "Marketing", color: "bg-[#f97316]" },
  { label: "Development", color: "bg-[#4f46e5]" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userName = useAppSelector((state) => state.auth.user?.name || "Portfolio Lead");
  const isPublicDashboard = pathname.startsWith("/pdashboard");
  const baseRoute = isPublicDashboard ? "/pdashboard" : "/dashboard";

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // best-effort logout
    }
    localStorage.removeItem("sip_token");
    localStorage.removeItem("sip_user");
    dispatch(clearCredentials());
    router.replace("/login");
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-[var(--border)] bg-white px-6 py-8 xl:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-sm font-semibold text-[var(--accent)]">
          SI
        </div>
        <div>
          <p className="text-base font-semibold text-[var(--accent-3)]">
            SIP Investor
          </p>
          <p className="text-xs text-[var(--muted)]">Portfolio Analytics</p>
        </div>
      </div>

      <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        Main Menu
      </p>
      <nav className="mt-3 flex flex-col gap-2">
        {navItems.map((item) => {
          const href = item.path ? `${baseRoute}/${item.path}` : baseRoute;
          const active = pathname === href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-[var(--surface-2)] text-[var(--accent-3)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--accent-3)]"
              )}
            >
              <Icon className="text-lg" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        Teams
      </p>
      <div className="mt-3 space-y-3 text-sm">
        {teamItems.map((team) => (
          <div key={team.label} className="flex items-center gap-3 text-[var(--muted)]">
            <span className={cn("h-2.5 w-2.5 rounded-full", team.color)} />
            {team.label}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <p className="text-xs text-[var(--muted)]">Signed in as</p>
        <p className="mt-1 text-sm font-semibold text-[var(--accent-3)]">
          {userName}
        </p>
        <Button className="mt-4 w-full" size="sm">
          New SIP
        </Button>
      </div>

      <div className="mt-auto flex flex-col gap-2 text-sm">
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--accent-3)]"
        >
          <RiSettingsLine className="text-lg" />
          Settings
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--accent-3)]"
        >
          <RiLogoutBoxLine className="text-lg" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
