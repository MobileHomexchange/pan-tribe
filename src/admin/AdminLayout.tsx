import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  const items = [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users" },
    { label: "Tribes", path: "/admin/tribes" },
    { label: "Content", path: "/admin/content" },
    { label: "Blog Management", path: "/admin/blog-management" },
    { label: "Event Analytics", path: "/admin/event-analytics" },
    { label: "Social Commerce", path: "/admin/social-commerce-accounts" },
    { label: "Monetization", path: "/admin/monetization" },
    { label: "Features", path: "/admin/features" },
    { label: "Ads Dashboard", path: "/admin/ads-dashboard" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`w-64 border-r ${open ? "" : "hidden md:block"}`}>
        <div className="p-4 font-bold">Admin</div>
        <nav className="p-2 space-y-1">
          {items.map((i) => (
            <NavLink
              key={i.path}
              to={i.path}
              end={i.path === "/admin"}
              className={({ isActive }) =>
                "block px-3 py-2 rounded " + (isActive ? "bg-gray-200" : "hover:bg-gray-100")
              }
            >
              {i.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1">
        <header className="h-12 border-b flex items-center px-4 md:hidden">
          <button onClick={() => setOpen(!open)} className="border px-3 py-1 rounded">
            Menu
          </button>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
