import { AdData } from "@/types/ads";

export function selectWeightedAd(ads: AdData[], preferPremium = true): AdData | null {
  let activeAds = ads.filter((ad) => ad.isActive);
  if (!activeAds.length) return null;

  if (preferPremium) {
    const premiumAds = activeAds.filter((ad) => ad.isPremium || ad.priority >= 4);
    if (premiumAds.length) activeAds = premiumAds;
  }

  const weightedAds: AdData[] = [];
  activeAds.forEach((ad) => {
    for (let i = 0; i < ad.priority; i++) {
      weightedAds.push(ad);
    }
  });

  return weightedAds[Math.floor(Math.random() * weightedAds.length)];
}