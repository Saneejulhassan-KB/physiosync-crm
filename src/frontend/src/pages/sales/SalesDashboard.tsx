import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SALES_STATS } from "@/lib/salesPatientData";
import { Briefcase, Phone, TrendingUp, Users } from "lucide-react";

export default function SalesDashboard() {
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
    </div>
  );
}
