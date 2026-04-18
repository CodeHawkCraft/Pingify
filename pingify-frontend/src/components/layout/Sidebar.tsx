import { NavLink, useNavigate } from "react-router-dom";
import { Activity, Globe } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { logout } from "../../api/auth.api";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const navItems = [
  // { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/monitors", icon: Activity, label: "Monitors" },
  { to: "/websites", icon: Globe, label: "Websites" },
];

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { setUser } = useUser();
  const navigate = useNavigate();


  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed h-full z-30 flex flex-col w-56 border-r bg-base-200 px-4 py-6
          transition-transform duration-200
          md:static md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <p className="text-base font-bold tracking-widest uppercase text-primary mb-6">
          Pingify
        </p>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
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

          <button onClick={handleLogout} className="btn btn-ghost btn-sm justify-start">
            Logout
          </button>
      </aside>
    </>
  );
};

export default Sidebar;
