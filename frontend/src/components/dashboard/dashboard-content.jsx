"use client";

import { useMemo } from "react";
import { RiArrowRightLine, RiLineChartLine } from "react-icons/ri";

import { formatCurrency, formatNumber } from "@/lib/format";
import { useDashboardData } from "@/contexts/dashboard-data-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const statusTone = {
  ACTIVE: "success",
  PAUSED: "warn",
  STOPPED: "danger",
};

const avatarPalette = ["bg-[#e3f2f4]", "bg-[#fff1e0]", "bg-[#eceffe]"];

function formatShortDate(value) {
  if (!value) return "No approvals";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No approvals";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export default function DashboardContent() {
  const { funds, investors, sips, loading, error } = useDashboardData();

  const stats = useMemo(() => {
    const activeSips = sips.filter((sip) => sip.status === "ACTIVE").length;
    const pausedSips = sips.filter((sip) => sip.status === "PAUSED").length;
    const stoppedSips = sips.filter((sip) => sip.status === "STOPPED").length;
    const monthlyVolume = sips.reduce(
      (total, sip) => total + Number(sip.sip_amount || 0),
      0
    );
    const avgNav = funds.length
      ? funds.reduce((sum, fund) => sum + Number(fund.latest_nav || 0), 0) /
        funds.length
      : 0;

    return {
      activeSips,
      pausedSips,
      stoppedSips,
      monthlyVolume,
      avgNav,
    };
  }, [sips, funds]);

  const topFunds = [...funds]
    .sort((a, b) => Number(b.latest_nav) - Number(a.latest_nav))
    .slice(0, 6);

  const latestSip = [...sips].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  const approvalLabel = latestSip?.created_at
    ? `${formatShortDate(latestSip.created_at)} approval`
    : "No approvals";

  const recentInvestors = investors.slice(0, 3);
  const recentPayments = [...sips]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2);
  const transactions = [...sips].slice(0, 6);

  const sparkline = useMemo(() => {
    const values = topFunds.map((fund) => Number(fund.latest_nav)).slice(0, 6);
    if (values.length < 2) return "";
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 140;
        const y = 48 - ((value - min) / range) * 36;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [topFunds]);

  const totalSips = stats.activeSips + stats.pausedSips + stats.stoppedSips || 1;
  const incomeBars = [
    {
      label: "Active",
      value: Math.round((stats.activeSips / totalSips) * 100),
      color: "bg-[var(--accent)]",
    },
    {
      label: "Paused",
      value: Math.round((stats.pausedSips / totalSips) * 100),
      color: "bg-[#c7cedf]",
    },
    {
      label: "Stopped",
      value: Math.round((stats.stoppedSips / totalSips) * 100),
      color: "bg-[var(--accent-2)]",
    },
  ];

  const avgSip = stats.activeSips
    ? stats.monthlyVolume / stats.activeSips
    : stats.monthlyVolume;

  return (
    <div className="space-y-6 rise-in">
      {loading && (
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-white px-5 py-3 text-sm text-[var(--muted)]">
          Loading live data...
        </div>
      )}
      {error && (
        <div className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-4">
        <Card className="border-dashed">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Payments</CardTitle>
                <p className="text-xs text-[var(--muted)]">{approvalLabel}</p>
              </div>
              <span className="text-xs text-[var(--muted)]">
                {formatNumber(stats.activeSips)} active
              </span>
            </div>
            <div className="flex items-center gap-2">
              {recentInvestors.map((investor, index) => {
                const initials = `${investor.first_name?.[0] || ""}${
                  investor.last_name?.[0] || ""
                }`;
                return (
                  <div
                    key={investor.investor_id}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-[var(--accent-3)] ${
                      avatarPalette[index % avatarPalette.length]
                    }`}
                  >
                    {initials || "SI"}
                  </div>
                );
              })}
              {investors.length > 3 && (
                <span className="text-xs text-[var(--muted)]">
                  +{investors.length - 3}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-semibold text-[var(--accent-3)]">
              {formatCurrency(stats.monthlyVolume)}
            </p>
            <p className="text-xs text-[var(--muted)]">Monthly payouts</p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle>Savings</CardTitle>
              <RiLineChartLine className="text-lg text-[var(--accent)]" />
            </div>
            <div className="h-16">
              {sparkline ? (
                <svg width="140" height="56" viewBox="0 0 140 56">
                  <polyline
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    points={sparkline}
                  />
                </svg>
              ) : (
                <div className="text-xs text-[var(--muted)]">No data yet</div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-semibold text-[var(--accent-3)]">
              {formatCurrency(stats.avgNav)}
            </p>
            <p className="text-xs text-[var(--muted)]">Average NAV</p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="space-y-2">
            <CardTitle>Income statistics</CardTitle>
            <p className="text-xs text-[var(--muted)]">SIP status balance</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-3">
              {incomeBars.map((bar) => (
                <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-20 w-full items-end">
                    <div
                      className={`w-full rounded-xl ${bar.color}`}
                      style={{ height: `${Math.max(bar.value, 10)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[var(--accent-3)]">
                    {bar.value}%
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-[var(--muted)]">
              {incomeBars.map((bar) => (
                <span key={bar.label}>{bar.label}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-gradient-to-br from-[#22b8c7] to-[#1aa3b5] p-5 text-white shadow-[var(--shadow)]">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <p className="text-2xl font-semibold">
                {formatCurrency(avgSip || stats.monthlyVolume)}
              </p>
              <p className="text-xs text-white/80">Per month</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Choose Best Plan For You</p>
              <p className="text-xs text-white/80">Upgrade your SIP coverage</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full bg-white/20 px-4 py-1.5 text-xs"
              >
                Details
              </button>
              <button
                type="button"
                className="rounded-full bg-black/80 px-4 py-1.5 text-xs"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recently Payments</CardTitle>
            <p className="text-xs text-[var(--muted)]">Last processed SIPs</p>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentPayments.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No payments yet.</p>
          )}
          {recentPayments.map((sip) => (
            <div
              key={sip.sip_id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--accent-3)]">
                  {sip.investor_name}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {sip.fund_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[var(--accent-3)]">
                  {formatCurrency(Number(sip.sip_amount))}
                </p>
                <Badge variant={statusTone[sip.status]}>{sip.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transactions</CardTitle>
            <p className="text-xs text-[var(--muted)]">Recent SIP activity</p>
          </div>
          <div className="w-56">
            <Input placeholder="Search" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr>
                  <th className="pb-3 font-medium">Receiver</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 text-right font-medium">Amount</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {transactions.length === 0 && (
                  <tr>
                    <td className="py-4 text-sm text-[var(--muted)]" colSpan={6}>
                      No transactions yet.
                    </td>
                  </tr>
                )}
                {transactions.map((sip) => (
                  <tr key={sip.sip_id}>
                    <td className="py-3 font-semibold text-[var(--accent-3)]">
                      {sip.investor_name}
                    </td>
                    <td className="py-3 text-[var(--muted)]">{sip.fund_name}</td>
                    <td className="py-3">
                      <Badge variant={statusTone[sip.status]}>{sip.status}</Badge>
                    </td>
                    <td className="py-3 text-[var(--muted)]">
                      {sip.start_date}
                    </td>
                    <td className="py-3 text-right font-semibold text-[var(--accent-3)]">
                      {formatCurrency(Number(sip.sip_amount))}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--accent-3)]"
                      >
                        Details
                        <RiArrowRightLine className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card id="investors">
        <CardHeader>
          <CardTitle>Investors</CardTitle>
          <p className="text-xs text-[var(--muted)]">
            Latest registered investors and contact details.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr>
                  <th className="pb-3 font-medium">Investor</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {investors.length === 0 && (
                  <tr>
                    <td className="py-4 text-sm text-[var(--muted)]" colSpan={3}>
                      No investors found.
                    </td>
                  </tr>
                )}
                {investors.map((investor) => (
                  <tr key={investor.investor_id}>
                    <td className="py-3 font-semibold text-[var(--accent-3)]">
                      {investor.first_name} {investor.last_name}
                    </td>
                    <td className="py-3 text-[var(--muted)]">
                      {investor.email}
                    </td>
                    <td className="py-3 text-[var(--muted)]">
                      {investor.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card id="funds">
        <CardHeader>
          <CardTitle>Funds Directory</CardTitle>
          <p className="text-xs text-[var(--muted)]">
            Latest NAV values by fund and AMC.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr>
                  <th className="pb-3 font-medium">Fund</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">AMC</th>
                  <th className="pb-3 text-right font-medium">NAV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {funds.length === 0 && (
                  <tr>
                    <td className="py-4 text-sm text-[var(--muted)]" colSpan={4}>
                      No fund data found.
                    </td>
                  </tr>
                )}
                {funds.map((fund) => (
                  <tr key={fund.fund_id}>
                    <td className="py-3 font-semibold text-[var(--accent-3)]">
                      {fund.fund_name}
                    </td>
                    <td className="py-3 text-[var(--muted)]">
                      {fund.fund_type} | {fund.category}
                    </td>
                    <td className="py-3 text-[var(--muted)]">{fund.amc_name}</td>
                    <td className="py-3 text-right font-semibold text-[var(--accent-3)]">
                      {formatCurrency(Number(fund.latest_nav))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card id="sips">
        <CardHeader>
          <CardTitle>SIP Overview</CardTitle>
          <p className="text-xs text-[var(--muted)]">
            All SIP schedules with installment dates.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr>
                  <th className="pb-3 font-medium">Investor</th>
                  <th className="pb-3 font-medium">Fund</th>
                  <th className="pb-3 font-medium">Installment Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {sips.length === 0 && (
                  <tr>
                    <td className="py-4 text-sm text-[var(--muted)]" colSpan={5}>
                      No SIPs created yet.
                    </td>
                  </tr>
                )}
                {sips.map((sip) => (
                  <tr key={sip.sip_id}>
                    <td className="py-3 font-semibold text-[var(--accent-3)]">
                      {sip.investor_name}
                    </td>
                    <td className="py-3 text-[var(--muted)]">{sip.fund_name}</td>
                    <td className="py-3 text-[var(--muted)]">{sip.sip_date}</td>
                    <td className="py-3">
                      <Badge variant={statusTone[sip.status]}>{sip.status}</Badge>
                    </td>
                    <td className="py-3 text-right font-semibold text-[var(--accent-3)]">
                      {formatCurrency(Number(sip.sip_amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
