import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bar } from "react-chartjs-2";

interface AdData {
  isActive: boolean;
  content: string;
  clicks: number;
  uniqueClicks: Record<string, any>;
}

export default function UnifiedAdsDashboard() {
  const [feedAd, setFeedAd] = useState<AdData>({ isActive: false, content: "", clicks: 0, uniqueClicks: {} });
  const [reelsAd, setReelsAd] = useState<AdData>({ isActive: false, content: "", clicks: 0, uniqueClicks: {} });

  // Fetch Feed Ad
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "adminSettings", "feedAd"), (docSnap) => {
      if (docSnap.exists()) {
        setFeedAd(docSnap.data() as AdData);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Reels Ad
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "adminSettings", "adBanner"), (docSnap) => {
      if (docSnap.exists()) {
        setReelsAd(docSnap.data() as AdData);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = async (adType: "feedAd" | "adBanner", currentValue: boolean) => {
    await updateDoc(doc(db, "adminSettings", adType), { isActive: !currentValue });
  };

  const handleContentChange = async (adType: "feedAd" | "adBanner", content: string) => {
    await updateDoc(doc(db, "adminSettings", adType), { content });
  };

  const getUniqueClickCount = (ad: AdData) => Object.keys(ad.uniqueClicks || {}).length;

  const chartData = {
    labels: ["Feed Ads", "Reels Ads"],
    datasets: [
      {
        label: "Total Clicks",
        data: [feedAd.clicks, reelsAd.clicks],
        backgroundColor: ["#F97316", "#EA580C"],
      },
      {
        label: "Unique Clicks",
        data: [getUniqueClickCount(feedAd), getUniqueClickCount(reelsAd)],
        backgroundColor: ["#FBBF24", "#FCD34D"],
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Unified Ads Dashboard</h1>

      {/* Feed Ad Management */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-semibold">Feed Ad</h2>
        <label className="flex items-center space-x-2">
          <span>Active</span>
          <input
            type="checkbox"
            checked={feedAd.isActive}
            onChange={() => handleToggle("feedAd", feedAd.isActive)}
            className="w-5 h-5"
          />
        </label>
        <textarea
          value={feedAd.content}
          onChange={(e) => handleContentChange("feedAd", e.target.value)}
          placeholder="Ad content or video URL"
          className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
        />
        {feedAd.isActive && feedAd.content && (
          <div className="p-2 border rounded-md bg-gray-100 dark:bg-gray-900">
            <span className="font-semibold">Preview:</span> {feedAd.content}
          </div>
        )}
        <p>Total Clicks: {feedAd.clicks}</p>
        <p>Unique Clicks: {getUniqueClickCount(feedAd)}</p>
      </div>

      {/* Reels Ad Management */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-semibold">Reels Ad</h2>
        <label className="flex items-center space-x-2">
          <span>Active</span>
          <input
            type="checkbox"
            checked={reelsAd.isActive}
            onChange={() => handleToggle("adBanner", reelsAd.isActive)}
            className="w-5 h-5"
          />
        </label>
        <textarea
          value={reelsAd.content}
          onChange={(e) => handleContentChange("adBanner", e.target.value)}
          placeholder="Ad video URL"
          className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700"
        />
        {reelsAd.isActive && reelsAd.content && (
          <div className="p-2 border rounded-md bg-gray-100 dark:bg-gray-900">
            <span className="font-semibold">Preview:</span> {reelsAd.content}
          </div>
        )}
        <p>Total Clicks: {reelsAd.clicks}</p>
        <p>Unique Clicks: {getUniqueClickCount(reelsAd)}</p>
      </div>

      {/* Analytics Chart */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Ads Analytics</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
}