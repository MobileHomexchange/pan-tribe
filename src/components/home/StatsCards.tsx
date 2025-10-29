interface StatsCardsProps {
  tribeMembers: number;
  activeNow: number;
  newPosts: number;
}

export function StatsCards({ tribeMembers, activeNow, newPosts }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        value={formatNumber(tribeMembers)}
        label="Tribe Members"
      />
      <StatCard
        value={formatNumber(activeNow)}
        label="Active Now"
      />
      <StatCard
        value={formatNumber(newPosts)}
        label="New Posts"
      />
    </div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 text-center shadow hover:shadow-md transition-all">
      <div className="text-4xl font-bold text-primary mb-2">{value}</div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
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
