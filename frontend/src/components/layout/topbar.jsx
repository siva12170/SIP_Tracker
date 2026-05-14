"use client";

export default function Topbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-semibold text-[var(--accent-3)]">
          Analytics
        </h1>
        <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-1">
          <button
            type="button"
            className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[var(--accent-3)] shadow-sm"
          >
            Full Statistics
          </button>
          <button
            type="button"
            className="rounded-full px-4 py-1.5 text-xs font-semibold text-[var(--muted)]"
          >
            Results Summary
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-lg font-semibold text-[var(--accent-3)]"
        >
          +
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-2)] text-sm font-semibold text-[var(--accent-3)]">
          SR
        </div>
      </div>
    </div>
  );
}
