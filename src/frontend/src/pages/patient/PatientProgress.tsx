import { MOCK_PATIENT_PROFILE, THERAPY_SESSIONS } from "@/lib/salesPatientData";
import { Activity, TrendingUp, Zap } from "lucide-react";

const latestSession = THERAPY_SESSIONS[THERAPY_SESSIONS.length - 1];
const overallProgress = latestSession.progressPercent;

export default function PatientProgress() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold font-display text-foreground">
        Therapy Progress
      </h1>

      {/* Progress Header */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {MOCK_PATIENT_PROFILE.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Post-ACL Rehabilitation Programme
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="text-center">
            <div className="text-3xl font-bold font-display text-primary">
              {overallProgress}%
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Overall Progress
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-display text-foreground">
              {latestSession.sessionNumber}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Sessions Done
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-display text-foreground">
              {latestSession.totalSessions}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Total Planned
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Start</span>
          <span className="text-xs font-medium text-primary">
            {overallProgress}% complete
          </span>
          <span className="text-xs text-muted-foreground">Goal</span>
        </div>
      </div>

      {/* Session Timeline */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">
          Session History
        </h2>
        <div className="space-y-4">
          {[...THERAPY_SESSIONS].reverse().map((session, i) => (
            <div
              key={session.id}
              data-ocid={`patient.progress.session.item.${i + 1}`}
              className="rounded-xl border border-border bg-card p-5"
            >
              {/* Session header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Session {session.sessionNumber} / {session.totalSessions}
                    </span>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        session.painLevel <= 3
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : session.painLevel <= 6
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      Pain {session.painLevel}/10
                    </span>
                  </div>
                  <div className="font-semibold text-foreground mt-0.5">
                    {session.sessionType}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.date} · {session.therapistName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {session.progressPercent}%
                  </div>
                  <div className="text-xs text-muted-foreground">progress</div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { label: "Mobility", value: session.mobility, max: 10 },
                  { label: "Strength", value: session.strength, max: 10 },
                  {
                    label: "Pain (inv)",
                    value: 10 - session.painLevel,
                    max: 10,
                  },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-medium text-foreground">
                        {m.value}/{m.max}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(m.value / m.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <p className="text-sm text-muted-foreground mb-3">
                {session.notes}
              </p>

              {/* Exercises */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {session.exercises.map((ex) => (
                  <span
                    key={ex}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    <Zap className="w-3 h-3" />
                    {ex}
                  </span>
                ))}
              </div>

              {/* Before/After placeholders */}
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 rounded-xl bg-muted/30 border border-border flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-5 h-5 text-muted-foreground mx-auto mb-0.5" />
                    <span className="text-xs text-muted-foreground">
                      Before
                    </span>
                  </div>
                </div>
                <div className="h-20 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-5 h-5 text-primary mx-auto mb-0.5" />
                    <span className="text-xs text-primary">After</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
