import React, { useEffect } from "react";

// NEW: pull in the homepage building blocks
import FullBleedHero from "../components/FullBleedHero";
import Kpi from "../components/Kpi";
import Composer from "../components/Composer";
import ActionsBar from "../components/ActionsBar";
import Feed from "../components/Feed";
import PromoCard from "../components/PromoCard";

// If you keep separate CSS, keep this import. Otherwise you can remove it.
// import "../styles/Feed.css";

export default function FeedPage() {
  // Tiny script to open/close the dashboard sidebar
  useEffect(() => {
    const overlay = document.getElementById("dashboardOverlay");
    const sidebar = document.getElementById("dashboardSidebar");
    const openBtn = document.getElementById("dashboardOpen");
    const closeBtn = document.getElementById("dashboardClose");

    const open = () => {
      if (!overlay || !sidebar) return;
      overlay.style.display = "block";
      sidebar.style.transform = "translateX(0)";
    };
    const close = () => {
      if (!overlay || !sidebar) return;
      overlay.style.display = "none";
      sidebar.style.transform = "translateX(-100%)";
    };

    openBtn?.addEventListener("click", open);
    overlay?.addEventListener("click", close);
    closeBtn?.addEventListener("click", close);

    // start hidden
    close();

    return () => {
      openBtn?.removeEventListener("click", open);
      overlay?.removeEventListener("click", close);
      closeBtn?.removeEventListener("click", close);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Full-bleed hero (uses /public/images/hero-grow-your-tribe.png) */}
      <FullBleedHero />

      {/* Top bar with a Dashboard button to open the sidebar */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-4 mb-2 flex justify-end">
          <button id="dashboardOpen" className="rounded-lg border px-3 py-2 bg-white hover:bg-gray-50">
            📊 Dashboard
          </button>
        </div>
      </div>

      {/* KPI Row + Feed + Promo in a responsive 3-col grid */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4 md:col-span-3">
            <Kpi label="Tribe Members" value="1" />
            <Kpi label="Active Now" value="496" />
            <Kpi label="New Posts" value="89" />
          </div>

          {/* Center column: composer + actions + feed */}
          <div className="order-2 md:order-1 md:col-span-2">
            <Composer />
            <ActionsBar />
            <Feed />
          </div>

          {/* Right column: promo card */}
          <div className="order-1 md:order-2">
            <PromoCard />
          </div>
        </div>
      </div>

      {/* === Your existing Dashboard sidebar + overlay (kept intact) === */}
      <div className="dashboard-overlay" id="dashboardOverlay" />
      <aside className="dashboard-sidebar" id="dashboardSidebar" aria-hidden="true">
        <div className="dashboard-close" id="dashboardClose">×</div>
        <h2 className="dashboard-title">
          <span>📊</span> Dashboard
        </h2>

        {/* Tribe Management */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title"><span>👥</span> Tribe Management</h3>
          <div className="dashboard-item"><span className="dashboard-item-icon">📈</span> Member Analytics</div>
          <div className="dashboard-item"><span className="dashboard-item-icon">📢</span> Announcements</div>
          <div className="dashboard-item"><span className="dashboard-item-icon">🛡️</span> Moderation Tools</div>
        </div>

        {/* Growth Tools */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title"><span>📈</span> Growth Tools</h3>
          <div className="dashboard-item"><span className="dashboard-item-icon">🎯</span> Targeting Options</div>
          <div className="dashboard-item"><span className="dashboard-item-icon">📣</span> Promotion Tools</div>
          <div className="dashboard-item"><span className="dashboard-item-icon">📊</span> Conversion Tracking</div>
        </div>

        {/* Quick Access */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title"><span>⭐</span> Quick Access</h3>
          <div className="dashboard-menu-item"><span className="dashboard-menu-icon">👥</span> Friends</div>
          <div className="dashboard-menu-item"><span className="dashboard-menu-icon">💾</span> Saved</div>
          <div className="dashboard-menu-item"><span className="dashboard-menu-icon">🏠</span> My Tribe</div>
          <div className="dashboard-menu-item"><span className="dashboard-menu-icon">📸</span> Memories</div>
          <div className="dashboard-menu-item"><span className="dashboard-menu-icon">📅</span> Events</div>
          <div className="dashboard-menu-item"><span className="dashboard-menu-icon">💰</span> Ads Manager</div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title"><span>📅</span> Upcoming Events</h3>
          <div className="event-item"><span className="event-icon">🔥</span><div className="event-name">Digital Campfire: Storytelling Night</div></div>
          <div className="event-item"><span className="event-icon">🌱</span><div className="event-name">Tribe Growth Workshop</div></div>
          <div className="event-item"><span className="event-icon">🌟</span><div className="event-name">Community Leaders Summit</div></div>
        </div>
      </aside>

      {/* Minimal CSS, kept inline like your original */}
      <style>{`
        /* Overlay + slide-in sidebar */
        .dashboard-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.3);
          display: none;
          z-index: 40;
        }
        .dashboard-sidebar {
          position: fixed; top: 0; left: 0;
          width: 320px; height: 100vh;
          background-color: #fff;
          box-shadow: 2px 0 15px rgba(0,0,0,0.1);
          padding: 80px 25px 20px;
          overflow-y: auto;
          font-family: 'Poppins', sans-serif;
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
        }
        .dashboard-title { font-size: 24px; font-weight: 700; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .dashboard-section { margin-bottom: 30px; }
        .dashboard-section-title { font-size: 18px; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #eee; padding-bottom: 8px; }
        .dashboard-item, .dashboard-menu-item {
          padding: 10px 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px;
          transition: background 0.3s; cursor: pointer; margin-bottom: 8px;
        }
        .dashboard-item:hover, .dashboard-menu-item:hover { background-color: #f0f0f0; }
        .dashboard-menu-icon, .dashboard-item-icon { width: 24px; text-align: center; }
        .event-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #eee; }
        .event-name { font-weight: 500; font-size: 14px; }
        .dashboard-close { position: absolute; top: 14px; right: 16px; font-size: 28px; cursor: pointer; }
      `}</style>
    </main>
  );
}
