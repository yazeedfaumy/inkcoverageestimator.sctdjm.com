import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileUp, ChevronLeft, ChevronRight, X } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  showMobile: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  collapsed,
  onCollapse,
  showMobile,
  onMobileClose
}: SidebarProps) {
  const links = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard"
    },
    {
      to: "/dashboard/analysis",
      icon: FileUp,
      label: "File Analysis"
    }
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-600">
            Navigation
          </span>
        )}
        <button
          onClick={onCollapse}
          className="p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none hidden md:block"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
        <button
          onClick={onMobileClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none md:hidden"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <nav className="space-y-1 px-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-yellow-100 text-green-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <>
      <div
        className={`hidden md:flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          collapsed ? "w-[4.5rem]" : "w-64"
        }`}
      >
        {sidebarContent}
      </div>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 md:hidden ${
          showMobile ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onMobileClose}
      />
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white z-30 transform transition-transform duration-300 md:hidden ${
          showMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}