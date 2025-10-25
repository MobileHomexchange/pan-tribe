import FullBleedHero from "../components/FullBleedHero";
import Kpi from "../components/Kpi";
import Composer from "../components/Composer";
import ActionsBar from "../components/ActionsBar";
import Feed from "../components/Feed";
import PromoCard from "../components/PromoCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <FullBleedHero />

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          
          {/* KPI Row */}
          <div className="grid grid-cols-3 gap-4 md:col-span-3">
            <Kpi label="Tribe Members" value="1.2K" />
            <Kpi label="Active Now" value="245" />
            <Kpi label="New Posts" value="89" />
          </div>

          {/* Feed Section */}
          <div className="order-2 md:order-1 md:col-span-2">
            <Composer />
            <ActionsBar />
            <Feed />
          </div>

          {/* Sidebar Promo */}
          <div className="order-1 md:order-2">
            <PromoCard />
          </div>

        </div>
      </div>
    </main>
  );
}
