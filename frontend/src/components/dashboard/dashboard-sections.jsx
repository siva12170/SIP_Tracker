"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/contexts/dashboard-data-context";
import { formatCurrency } from "@/lib/format";

const statusTone = {
  ACTIVE: "success",
  PAUSED: "warn",
  STOPPED: "danger",
};


function SectionShell({
  loading,
  error,
  children,
}) {
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
      {children}
    </div>
  );
}

export function InvestorsSection() {
  const { investors, loading, error } = useDashboardData();

  return (
    <SectionShell loading={loading} error={error}>
      <Card>
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
                    <td className="py-3 text-[var(--muted)]">{investor.email}</td>
                    <td className="py-3 text-[var(--muted)]">{investor.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  );
}

export function FundsSection() {
  const { funds, loading, error } = useDashboardData();

  return (
    <SectionShell loading={loading} error={error}>
      <Card>
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
    </SectionShell>
  );
}

export function SipsSection() {
  const { sips, loading, error } = useDashboardData();

  return (
    <SectionShell loading={loading} error={error}>
      <Card>
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
    </SectionShell>
  );
}
