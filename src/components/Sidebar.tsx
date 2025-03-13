import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  ListChecks,
  DollarSign,
  FileText,
  Users as UsersIcon,
  UserPlus,
  Shield,
  BarChart2,
  GraduationCap as Graduation,
  Settings,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 md:relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          <NavItem
            to="/"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            isActive={location.pathname === "/"}
            collapsed={collapsed}
          />
          <NavItem
            to="/students"
            icon={<Users className="h-4 w-4" />}
            label="Student Management"
            isActive={location.pathname === "/students"}
            collapsed={collapsed}
          />
          <NavItem
            to="/clearance"
            icon={<CheckSquare className="h-4 w-4" />}
            label="Clearance Workflow"
            isActive={location.pathname === "/clearance"}
            collapsed={collapsed}
          />
          <NavItem
            to="/graduation-list"
            icon={<ListChecks className="h-4 w-4" />}
            label="Graduation Lists"
            isActive={location.pathname === "/graduation-list"}
            collapsed={collapsed}
          />
          <NavItem
            to="/finance"
            icon={<DollarSign className="h-4 w-4" />}
            label="Finance & Payments"
            isActive={location.pathname === "/finance"}
            collapsed={collapsed}
          />
          <NavItem
            to="/documents"
            icon={<FileText className="h-4 w-4" />}
            label="Document Management"
            isActive={location.pathname === "/documents"}
            collapsed={collapsed}
          />
          <NavItem
            to="/ceremony"
            icon={<UsersIcon className="h-4 w-4" />}
            label="Ceremony Coordination"
            isActive={location.pathname === "/ceremony"}
            collapsed={collapsed}
          />
          <NavItem
            to="/alumni"
            icon={<UserPlus className="h-4 w-4" />}
            label="Alumni Integration"
            isActive={location.pathname === "/alumni"}
            collapsed={collapsed}
          />
          <NavItem
            to="/admin"
            icon={<Shield className="h-4 w-4" />}
            label="System Administration"
            isActive={location.pathname === "/admin"}
            collapsed={collapsed}
          />
          <NavItem
            to="/reports"
            icon={<BarChart2 className="h-4 w-4" />}
            label="Reports & Analytics"
            isActive={location.pathname === "/reports"}
            collapsed={collapsed}
          />

          <NavItem
            to="/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Graduation Settings"
            isActive={location.pathname === "/settings"}
            collapsed={collapsed}
          />
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-2">
        <p
          className={cn(
            "text-xs text-muted-foreground px-2 py-1",
            collapsed && "hidden"
          )}
        >
          © 2025 Graduation System
        </p>
      </div>
    </aside>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  collapsed: boolean;
}

function NavItem({ to, icon, label, isActive, collapsed }: NavItemProps) {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      size={collapsed ? "icon" : "default"}
      className={cn(
        "justify-start",
        collapsed ? "h-9 w-9" : "h-9 px-3",
        isActive && "bg-secondary"
      )}
    >
      <Link to={to}>
        {icon}
        {!collapsed && <span className="ml-2">{label}</span>}
      </Link>
    </Button>
  );
}
