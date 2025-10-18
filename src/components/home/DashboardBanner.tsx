import { BarChart3 } from "lucide-react";

interface DashboardBannerProps {
  onOpenDashboard: () => void;
}

export function DashboardBanner({ onOpenDashboard }: DashboardBannerProps) {
  return (
    <div
      onClick={onOpenDashboard}
      className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-3">
        <BarChart3 className="w-7 h-7" />
        Dashboard
      </h2>
      <p className="text-center text-white/90 text-sm mt-2">
        View your tribe analytics
      </p>
    </div>
  );
}
