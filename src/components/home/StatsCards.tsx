import { Users, Activity, MessageSquare } from "lucide-react";

interface StatsCardsProps {
  tribeMembers: number;
  activeNow: number;
  newPosts: number;
}

export function StatsCards({ tribeMembers, activeNow, newPosts }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        icon={<Users className="w-5 h-5 text-terracotta" />}
        value={formatNumber(tribeMembers)}
        label="Tribe Members"
      />
      <StatCard
        icon={<Activity className="w-5 h-5 text-forest" />}
        value={formatNumber(activeNow)}
        label="Active Now"
      />
      <StatCard
        icon={<MessageSquare className="w-5 h-5 text-amber" />}
        value={formatNumber(newPosts)}
        label="New Posts"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="flex items-center justify-center mb-2">{icon}</div>
      <div className="text-3xl font-bold text-charcoal mb-1">{value}</div>
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
