import {
  GYM_ACTIVITY_LOGS,
  GYM_CALL_LOGS,
  GYM_LEADS,
  GYM_PARTNERSHIPS,
  PROMO_TRACKER_DATA,
} from "@/lib/salesPatientData";
import type { CallOutcome, LeadStage } from "@/types/sales";
import {
  Activity,
  Building,
  Clock,
  Mail,
  Phone,
  PhoneCall,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const stageColor: Record<LeadStage, string> = {
  new: "bg-muted text-muted-foreground",
  contacted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  qualified:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  proposal:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  negotiation:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  converted:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const outcomeColor: Record<CallOutcome, string> = {
  interested:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  callback_requested:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  not_interested:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  no_answer: "bg-muted text-muted-foreground",
  left_voicemail:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  converted: "bg-primary/10 text-primary",
};

const activityTypeIcon: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  call: PhoneCall,
  visit: Building,
  email: Mail,
  whatsapp: Phone,
  meeting: Users,
  demo: Activity,
};

const activityTypeBg: Record<string, string> = {
  call: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  visit:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  email: "bg-muted text-muted-foreground",
  whatsapp:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  meeting:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  demo: "bg-primary/10 text-primary",
};

const partnershipStatusBg: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  inactive: "bg-muted text-muted-foreground",
};

export default function GymFitnessTab() {
  return (
    <div className="space-y-8">
      {/* ── 1. Gym Partnership Cards ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Building className="w-4 h-4 text-primary" />
          Gym Partnerships
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GYM_PARTNERSHIPS.map((gym, i) => (
            <div
              key={gym.id}
              data-ocid={`sales.gym_partner.item.${i + 1}`}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-elevation-medium transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${partnershipStatusBg[gym.status]}`}
                >
                  {gym.status}
                </span>
              </div>
              <h4 className="font-semibold text-foreground mb-0.5">
                {gym.gymName}
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                {gym.location}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Contact</div>
                  <div className="font-medium text-foreground">
                    {gym.contactPerson}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium text-foreground capitalize">
                    {gym.partnershipType}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Leads</div>
                  <div className="font-medium text-foreground">
                    {gym.leadsGenerated}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Conversions</div>
                  <div className="font-medium text-foreground">
                    {gym.conversions}
                  </div>
                </div>
              </div>
              {gym.nextEvent && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Next Event
                  </div>
                  <div className="text-xs font-medium text-foreground">
                    {gym.nextEvent}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Promotion Tracker Chart ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Promotion Tracker
        </h3>
        <div className="rounded-xl border border-border bg-card p-5">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={PROMO_TRACKER_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="referrals"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="var(--secondary)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── 3. Activity Logs ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Activity Logs
        </h3>
        <div className="space-y-3">
          {GYM_ACTIVITY_LOGS.map((log, i) => {
            const Icon = activityTypeIcon[log.type] ?? Activity;
            return (
              <div
                key={log.id}
                data-ocid={`sales.gym_activity.item.${i + 1}`}
                className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${activityTypeBg[log.type]}`}
                    >
                      {log.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {log.date} · {log.time}
                    </span>
                  </div>
                  <div className="text-sm text-foreground">
                    {log.description}
                  </div>
                  {log.outcome && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Outcome: {log.outcome}
                    </div>
                  )}
                  {log.linkedTo && (
                    <div className="text-xs text-muted-foreground">
                      Linked: {log.linkedTo}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Gym Call Logs ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-primary" />
          Call Logs
        </h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Outcome
                  </th>
                </tr>
              </thead>
              <tbody>
                {GYM_CALL_LOGS.map((c, i) => (
                  <tr
                    key={c.id}
                    data-ocid={`sales.gym_call.item.${i + 1}`}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      <div>{c.date}</div>
                      <div className="text-xs">{c.time}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {c.contactName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {c.duration}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${outcomeColor[c.outcome]}`}
                      >
                        {c.outcome.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 5. Lead Pipeline ── */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Gym Lead Pipeline
        </h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Lead Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Next Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {GYM_LEADS.map((lead, i) => (
                  <tr
                    key={lead.id}
                    data-ocid={`sales.gym_lead.item.${i + 1}`}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {lead.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lead.source}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${stageColor[lead.stage]}`}
                      >
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      ${(lead.value ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {lead.followUpDate
                        ? `Follow up: ${lead.followUpDate}`
                        : "Onboarding"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
