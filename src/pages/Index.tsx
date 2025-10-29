import FullBleedHero from "../components/FullBleedHero";
import Kpi from "../components/Kpi";
import Composer from "../components/Composer";
import ActionsBar from "../components/ActionsBar";
import Feed from "../components/Feed";
import PromoCard from "../components/PromoCard";
import AdSense from "../components/ads/AdSense";
import HouseAd from "../components/ads/HouseAd";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <FullBleedHero />
      
      {/* Leaderboard Ad */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-4">
        <div className="flex justify-center">
          <AdSense
            slot="YOUR_LEADERBOARD_SLOT_ID"
            className="w-full"
            style={{ display: "block", minHeight: 90 }}
          />
        </div>
      </div>
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <div className="grid grid-cols-3 gap-4 md:col-span-3">
            <Kpi label="Tribe Members" value="1.2K" />
            <Kpi label="Active Now" value="245" />
            <Kpi label="New Posts" value="89" />
          </div>
          <div className="order-2 md:order-1 md:col-span-2">
            <Composer />
            <ActionsBar />
            
            {/* Optional In-Feed Ad */}
            <div className="my-4">
              <AdSense
                slot="YOUR_INFEED_SLOT_ID"
                format="fluid"
                layoutKey="-gw-3+1f-3d+2z"
                className="w-full"
                style={{ display: "block" }}
              />
            </div>
            
            <Feed />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <PromoCard />
            
            {/* House Ad */}
            <HouseAd
              href="https://your-offer.example.com"
              img="/ads/house-300x250.jpg"
              alt="Your Offer"
            />
            
            {/* AdSense Rectangle */}
            <AdSense
              slot="YOUR_RECTANGLE_SLOT_ID"
              className="w-full"
              style={{ display: "block", minHeight: 250 }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
