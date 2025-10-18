import { X, Users, TrendingUp, Target, Megaphone, BarChart3, Bell, Shield, Heart, Bookmark, Clock, ShoppingBag, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[350px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-charcoal text-white p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Dashboard
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Close dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="p-4 space-y-6">
          {/* Tribe Management */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-charcoal border-b-2 border-gray-200 pb-2">
              <Users className="w-5 h-5 text-forest" />
              Tribe Management
            </h3>
            <div className="space-y-1">
              <MenuItem
                icon={<BarChart3 className="w-4 h-4" />}
                label="Member Analytics"
                onClick={() => handleNavigate("/admin/users")}
              />
              <MenuItem
                icon={<Bell className="w-4 h-4" />}
                label="Announcements"
                onClick={() => handleNavigate("/feed")}
              />
              <MenuItem
                icon={<Shield className="w-4 h-4" />}
                label="Moderation Tools"
                onClick={() => handleNavigate("/admin/content")}
              />
            </div>
          </div>

          {/* Growth Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-charcoal border-b-2 border-gray-200 pb-2">
              <TrendingUp className="w-5 h-5 text-terracotta" />
              Growth Tools
            </h3>
            <div className="space-y-1">
              <MenuItem
                icon={<Target className="w-4 h-4" />}
                label="Targeting Options"
                onClick={() => handleNavigate("/ads-manager")}
              />
              <MenuItem
                icon={<Megaphone className="w-4 h-4" />}
                label="Promotion Tools"
                onClick={() => handleNavigate("/ads-manager")}
              />
              <MenuItem
                icon={<BarChart3 className="w-4 h-4" />}
                label="Conversion Tracking"
                onClick={() => handleNavigate("/admin/events")}
              />
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-charcoal border-b-2 border-gray-200 pb-2">
              <Clock className="w-5 h-5 text-amber" />
              Quick Access
            </h3>
            <div className="space-y-1">
              <MenuItem
                icon={<Heart className="w-4 h-4" />}
                label="Friends"
                onClick={() => handleNavigate("/friends")}
              />
              <MenuItem
                icon={<Bookmark className="w-4 h-4" />}
                label="Saved"
                onClick={() => handleNavigate("/saved")}
              />
              <MenuItem
                icon={<Users className="w-4 h-4" />}
                label="My Tribe"
                onClick={() => handleNavigate("/my-tribe")}
              />
              <MenuItem
                icon={<Clock className="w-4 h-4" />}
                label="Memories"
                onClick={() => handleNavigate("/memories")}
              />
              <MenuItem
                icon={<Calendar className="w-4 h-4" />}
                label="Events"
                onClick={() => handleNavigate("/events")}
              />
              <MenuItem
                icon={<ShoppingBag className="w-4 h-4" />}
                label="Ads Manager"
                onClick={() => handleNavigate("/ads-manager")}
              />
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-charcoal border-b-2 border-gray-200 pb-2">
              <Calendar className="w-5 h-5 text-sage" />
              Upcoming Events
            </h3>
            <div className="space-y-2">
              <EventItem
                icon="🎉"
                title="Community Meetup"
                date="Tomorrow, 3:00 PM"
              />
              <EventItem
                icon="📚"
                title="Learning Session"
                date="Friday, 6:00 PM"
              />
              <EventItem
                icon="🎵"
                title="Music Night"
                date="Saturday, 8:00 PM"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function MenuItem({ icon, label, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors text-left"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm font-medium text-charcoal">{label}</span>
    </button>
  );
}

interface EventItemProps {
  icon: string;
  title: string;
  date: string;
}

function EventItem({ icon, title, date }: EventItemProps) {
  return (
    <div className="p-3 bg-cream rounded-lg hover:bg-cream/80 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-charcoal">{title}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
    </div>
  );
}
