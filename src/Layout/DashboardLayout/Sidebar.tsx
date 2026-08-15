import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { adminRoutes } from "@/routes/AdminRoutes";
import { menuGenerator, MenuItem } from "@/utils/Generator/MenuGenerator";
import { Location } from "react-router-dom";
import { cn } from "@/lib/utils";

const exactMatchPaths = ["/admin", "/user"];

// Clean, tech-styled logo that matches the site's dark slate & blue theme
const BaseKitLogo = ({ collapsed }: { collapsed: boolean }) => {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-1">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-1 select-none">
      <svg viewBox="0 0 24 24" className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex flex-col">
        <div className="text-lg tracking-tight leading-none text-white font-medium flex items-baseline">
          <span>Base</span>
          <span className="font-semibold text-blue-500">Kit</span>
          <span className="text-[7px] font-normal align-super ml-0.5 opacity-80">TM</span>
        </div>
        <span className="text-[7px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
          Admin Template
        </span>
      </div>
    </div>
  );
};

const isRouteActive = (item: MenuItem, currentPath: string): boolean => {
  if (!item.path) return false;

  if (currentPath === item.path) return true;

  if (exactMatchPaths.includes(item.path)) return false;

  if (currentPath.startsWith(item.path + "/")) return true;

  if (item.children) {
    return item.children.some((child) => isRouteActive(child, currentPath));
  }

  return false;
};

const SidebarItem = ({ item, location }: { item: MenuItem; location: Location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!item.children?.length;
  const isActive = isRouteActive(item, location.pathname);

  return (
    <div className="w-full">
      {hasChildren ? (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center justify-between w-full h-10 px-4 text-base font-semibold rounded-xl transition-all duration-200 group text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200 opacity-60 group-hover:opacity-100",
                isOpen && "rotate-180"
              )}
            />
          </button>
          {isOpen && (
            <div className="mt-1 pl-4 space-y-2 border-l border-white/10 ml-6 animate-in slide-in-from-top-1 duration-200">
              {item.children!.map((child) => (
                <SidebarItem key={child.path} item={child} location={location} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <NavLink
          to={item.path || "#"}
          className={cn(
            "flex items-center gap-3 px-4 h-10 text-base font-semibold rounded-xl transition-all duration-200 no-underline!",
            isActive
              ? "bg-white text-slate-900 shadow-sm"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          {item.icon && (
            <span className={cn("shrink-0", isActive ? "text-slate-900" : "text-white/70")}>
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
        </NavLink>
      )}
    </div>
  );
};

const Sidebar = () => {
  const menu = menuGenerator(adminRoutes, "/admin");
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar-collapsed", String(nextState));
  };

  const groupedMenu = menu.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const group = item.group || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <aside
      className={cn(
        "bg-slate-900 text-white min-h-screen sticky top-0 flex flex-col transition-all duration-300 z-40 border-r border-slate-800 shrink-0 relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Floating Collapse/Expand Button aligned exactly on the border intersection */}
      <button
        onClick={toggleCollapse}
        className="absolute right-[-12px] top-16 z-50 transform -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer shadow-md hover:border-slate-500 transition-colors text-slate-400 hover:text-white focus:outline-none"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Sidebar Header with Site-styled BaseKit Logo - h-16 to align with Top Header */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800 px-4">
        <BaseKitLogo collapsed={isCollapsed} />
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7 scrollbar-thin scrollbar-thumb-slate-800">
        {Object.entries(groupedMenu).map(([group, items]) => (
          <div key={group} className="space-y-2">
            {!isCollapsed && (
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 px-4 block">
                {group}
              </span>
            )}
            <div className="space-y-2">
              {items.map((item) =>
                isCollapsed ? (
                  <Link
                    key={item.path}
                    to={item.path || "#"}
                    className={cn(
                      "flex items-center justify-center h-10 rounded-xl transition-all duration-200 hover:bg-slate-800",
                      isRouteActive(item, location.pathname)
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    {item.icon && (
                      <span
                        className={cn(
                          "shrink-0 [&_svg]:size-5",
                          isRouteActive(item, location.pathname)
                            ? "text-slate-900"
                            : "text-white/70"
                        )}
                      >
                        {item.icon}
                      </span>
                    )}
                  </Link>
                ) : (
                  <SidebarItem key={item.label + item.path} item={item} location={location} />
                )
              )}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
