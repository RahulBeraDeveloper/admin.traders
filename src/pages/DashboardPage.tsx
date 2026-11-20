import { Link } from "react-router-dom";
import { AreaChart, DonutChart, GroupedBarChart } from "../components/dashboard/Charts";
import { DEMO_STATS, MONTHLY_INVOICES, MONTHLY_VALUE_USD, RECENT_ACTIVITY, REGION_SPLIT } from "../data/dashboardDemo";
import { formatMoney } from "../utils/format";

const STATUS_STYLE: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Sent: "bg-amber-100 text-amber-800",
  Draft: "bg-gray-200 text-gray-700",
};

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-ink">{value}</div>
      <div className="mt-1 text-xs text-green-700">{hint}</div>
    </div>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border bg-white p-4 shadow-sm ${className}`}>
      <h2 className="mb-3 mt-0 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="m-0 text-xl font-semibold">Dashboard</h1>
          <p className="m-0 text-sm text-gray-500">Overview of your export documentation (demo data)</p>
        </div>
        <Link to="/invoices" className="btn btn-primary btn-sm">+ New proforma invoice</Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total proforma invoices" value={String(DEMO_STATS.proformaInvoices)} hint="▲ 12% vs last month" />
        <StatCard label="Invoices generated" value={String(DEMO_STATS.invoicesGenerated)} hint="▲ 8% vs last month" />
        <StatCard label="Pending / draft" value={String(DEMO_STATS.pendingInvoices)} hint="Awaiting buyer confirmation" />
        <StatCard label="Total value" value={`USD ${formatMoney(DEMO_STATS.totalValueUsd)}`} hint="▲ 18% vs last month" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Monthly invoice statistics">
          <GroupedBarChart data={MONTHLY_INVOICES} />
          <div className="mt-2 flex gap-4 text-xs text-gray-500">
            <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-brand" />Proforma</span>
            <span><i className="mr-1 inline-block h-2 w-2 rounded-sm" style={{ background: "#f1d27a" }} />Invoices</span>
          </div>
        </Panel>
        <Panel title="Invoice value (USD)">
          <AreaChart data={MONTHLY_VALUE_USD} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Invoices by region" className="lg:col-span-1">
          <DonutChart data={REGION_SPLIT} />
        </Panel>
        <Panel title="Recent invoice activity" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-2 pr-3 font-medium">Number</th>
                  <th className="py-2 pr-3 font-medium">Buyer</th>
                  <th className="py-2 pr-3 text-end font-medium">Amount</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ACTIVITY.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 last:border-0">
                    <td className="whitespace-nowrap py-2 pr-3 font-medium">{r.id}</td>
                    <td className="py-2 pr-3 text-gray-600">{r.buyer}</td>
                    <td className="whitespace-nowrap py-2 pr-3 text-end">USD {formatMoney(r.amount)}</td>
                    <td className="py-2 pr-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="whitespace-nowrap py-2 text-gray-500">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
