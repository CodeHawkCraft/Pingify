import { NavLink } from "react-router-dom";
import { Activity, Globe } from "lucide-react";
import { useClerk } from "@clerk/react";

export const DRAWER_ID = "dashboard-drawer";

const navItems = [
  // { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/monitors", icon: Activity, label: "Monitors" },
  { to: "/websites", icon: Globe, label: "Websites" },
];

// Uncheck the drawer toggle so the mobile drawer closes after navigating
const closeDrawer = () => {
  const toggle = document.getElementById(DRAWER_ID) as HTMLInputElement | null;
  if (toggle) toggle.checked = false;
};

const Sidebar = () => {
  const { signOut } = useClerk();

  return (
    <div className="drawer-side z-30">
      <label htmlFor={DRAWER_ID} aria-label="Close sidebar" className="drawer-overlay" />

      <aside className="flex flex-col min-h-full w-56 border-r bg-base-200 px-4 py-6">
        <p className="text-base font-bold tracking-widest uppercase text-primary mb-6">
          Ping-Links
        </p>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeDrawer}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm ${
                  isActive ? "bg-base-300 font-medium" : "hover:bg-base-300"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button onClick={() => signOut({ redirectUrl: "/" })} className="btn btn-ghost btn-sm justify-start">
          Logout
        </button>
      </aside>
    </div>
  );
};

export default Sidebar;
