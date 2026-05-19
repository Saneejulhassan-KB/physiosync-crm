import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SALES_STATS } from "@/lib/salesPatientData";
import { Briefcase, Phone, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import GymFitnessTab from "./GymFitnessTab";
import HospitalVisitTab from "./HospitalVisitTab";

type SalesTab = "hospital" | "gym";

export default function SalesDashboard() {
  const [activeTab, setActiveTab] = useState<SalesTab>("hospital");

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Sales Dashboard"
        subtitle="Track leads, visits, and outreach performance across all channels."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Leads This Week"
          value={SALES_STATS.leadsThisWeek}
          trend={SALES_STATS.leadsGrowth}
          trendLabel="vs last week"
          data-ocid="sales.stat.leads"
        />
        <StatCard
          icon={Briefcase}
          title="Visits Completed"
          value={SALES_STATS.visitsCompleted}
          trend={SALES_STATS.visitsGrowth}
          trendLabel="vs last week"
          data-ocid="sales.stat.visits"
        />
        <StatCard
          icon={TrendingUp}
          title="Conversion Rate"
          value={`${SALES_STATS.conversionRate}%`}
          trend={SALES_STATS.conversionGrowth}
          trendLabel="vs last week"
          data-ocid="sales.stat.conversion"
        />
        <StatCard
          icon={Phone}
          title="Avg Call Duration"
          value={SALES_STATS.avgCallDuration}
          data-ocid="sales.stat.call_duration"
        />
      </div>

      {/* Tab Switcher */}
      <div className="rounded-xl border border-border bg-card p-1 inline-flex gap-1">
        <button
          type="button"
          data-ocid="sales.tab.hospital"
          onClick={() => setActiveTab("hospital")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "hospital"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          🏥 Hospital Visit Executive
        </button>
        <button
          type="button"
          data-ocid="sales.tab.gym"
          onClick={() => setActiveTab("gym")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "gym"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          🏋️ Gym/Fitness Outreach
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "hospital" ? <HospitalVisitTab /> : <GymFitnessTab />}
      </div>
    </div>
  );
}
