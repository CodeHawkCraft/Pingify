import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar, { DRAWER_ID } from "./Sidebar";

const DashboardLayout = () => (
  <div className="drawer md:drawer-open h-screen">
    <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />

    <div className="drawer-content flex flex-col overflow-hidden">
      {/* Mobile topbar */}
      <header className="md:hidden flex items-center gap-3 border-b bg-base-200 px-4 py-3">
        <label htmlFor={DRAWER_ID} className="btn drawer-button" aria-label="Open sidebar">
          <Menu size={20} />
        </label>
        <span className="text-sm font-semibold">Ping-Links</span>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>

    <Sidebar />
  </div>
);

export default DashboardLayout;
