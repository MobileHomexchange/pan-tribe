import React from "react";
import "../styles/Feed.css"; // optional if you separate CSS

export default function Feed() {
  return (
    <div>
      {/* Dashboard Sidebar Overlay */}
      <div className="dashboard-overlay" id="dashboardOverlay"></div>
      <div className="dashboard-sidebar" id="dashboardSidebar">
        <div className="dashboard-close" id="dashboardClose">
          ×
        </div>
        <h2 className="dashboard-title">
          <span>📊</span> Dashboard
        </h2>

        {/* Tribe Management Section */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">
            <span>👥</span> Tribe Management
          </h3>
          <div className="dashboard-item">
            <span className="dashboard-item-icon">📈</span> Member Analytics
          </div>
          <div className="dashboard-item">
            <span className="dashboard-item-icon">📢</span> Announcements
          </div>
          <div className="dashboard-item">
            <span className="dashboard-item-icon">🛡️</span> Moderation Tools
          </div>
        </div>

        {/* Growth Tools Section */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">
            <span>📈</span> Growth Tools
          </h3>
          <div className="dashboard-item">
            <span className="dashboard-item-icon">🎯</span> Targeting Options
          </div>
          <div className="dashboard-item">
            <span className="dashboard-item-icon">📣</span> Promotion Tools
          </div>
          <div className="dashboard-item">
            <span className="dashboard-item-icon">📊</span> Conversion Tracking
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">
            <span>⭐</span> Quick Access
          </h3>
          <div className="dashboard-menu-item">
            <span className="dashboard-menu-icon">👥</span> Friends
          </div>
          <div className="dashboard-menu-item">
            <span className="dashboard-menu-icon">💾</span> Saved
          </div>
          <div className="dashboard-menu-item">
            <span className="dashboard-menu-icon">🏠</span> My Tribe
          </div>
          <div className="dashboard-menu-item">
            <span className="dashboard-menu-icon">📸</span> Memories
          </div>
          <div className="dashboard-menu-item">
            <span className="dashboard-menu-icon">📅</span> Events
          </div>
          <div className="dashboard-menu-item">
            <span className="dashboard-menu-icon">💰</span> Ads Manager
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-section">
          <h3 className="dashboard-section-title">
            <span>📅</span> Upcoming Events
          </h3>
          <div className="event-item">
            <span className="event-icon">🔥</span>
            <div className="event-name">Digital Campfire: Storytelling Night</div>
          </div>
          <div className="event-item">
            <span className="event-icon">🌱</span>
            <div className="event-name">Tribe Growth Workshop</div>
          </div>
          <div className="event-item">
            <span className="event-icon">🌟</span>
            <div className="event-name">Community Leaders Summit</div>
          </div>
        </div>
      </div>

      {/* You can add your main dashboard body here */}
      <main className="dashboard-main">
        <h1>Welcome to Tribe Pulse Dashboard</h1>
        <p>Customize this section with your feed or widgets.</p>
      </main>

      <style>{`
        .dashboard-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 320px;
          height: 100vh;
          background-color: #fff;
          box-shadow: 2px 0 15px rgba(0,0,0,0.1);
          padding: 80px 25px 20px;
          overflow-y: auto;
          font-family: 'Poppins', sans-serif;
        }
        .dashboard-title {
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .dashboard-section {
          margin-bottom: 30px;
        }
        .dashboard-section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 2px solid #eee;
          padding-bottom: 8px;
        }
        .dashboard-item,
        .dashboard-menu-item {
          padding: 10px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.3s;
          cursor: pointer;
          margin-bottom: 8px;
        }
        .dashboard-item:hover,
        .dashboard-menu-item:hover {
          background-color: #f0f0f0;
        }
        .dashboard-menu-icon,
        .dashboard-item-icon {
          width: 24px;
          text-align: center;
        }
        .event-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .event-name {
          font-weight: 500;
          font-size: 14px;
        }
        .dashboard-main {
          margin-left: 360px;
          padding: 40px;
          font-family: 'Roboto', sans-serif;
        }
      `}</style>
    </div>
  );
}
