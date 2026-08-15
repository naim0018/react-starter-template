import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { adminRoutes } from "@/routes/AdminRoutes";
import { menuGenerator, MenuItem } from "@/utils/Generator/MenuGenerator";
import { Location } from "react-router-dom";
import { cn } from "@/lib/utils";

const exactMatchPaths = ["/admin", "/user"];

const SeeSayDoLogo = ({ collapsed }: { collapsed: boolean }) => {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-1">
        <svg viewBox="0 0 100 40" className="w-10 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 15 30 Q 35 10 55 30" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 35 30 Q 55 10 75 30" stroke="#4ade80" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 55 30 Q 75 10 95 30" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-1 select-none">
      <svg viewBox="0 0 160 45" className="w-32 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 30 35 Q 55 12 80 35" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 50 35 Q 75 12 100 35" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 70 35 Q 95 12 120 35" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
      
      <div className="text-lg tracking-tight leading-none text-white font-medium flex items-baseline mt-1">
        <span>See</span>
        <span className="font-semibold text-white">Say</span>
        <span>Do</span>
        <span className="text-[7px] font-normal align-super ml-0.5 opacity-80">TM</span>
      </div>
      
      <div className="text-[6px] font-semibold tracking-[0.15em] text-orange-500 uppercase mt-1">
        A Player Development System
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
              "flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-200 group text-white/70 hover:bg-white/10 hover:text-white"
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
            <div className="mt-1 pl-4 space-y-1 border-l border-white/10 ml-6 animate-in slide-in-from-top-1 duration-200">
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
            "flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-200 no-underline!",
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
      {/* Floating Collapse/Expand Button */}
      <button
        onClick={toggleCollapse}
        className="absolute right-[-12px] top-8 z-50 transform -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer shadow-md hover:border-orange-500 transition-colors text-orange-500 hover:text-orange-400 focus:outline-none"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Sidebar Header with SeeSayDo Logo */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800 px-4">
        <SeeSayDoLogo collapsed={isCollapsed} />
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
            <div className="space-y-1">
              {items.map((item) =>
                isCollapsed ? (
                  <Link
                    key={item.path}
                    to={item.path || "#"}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-xl transition-all duration-200 hover:bg-slate-800",
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
