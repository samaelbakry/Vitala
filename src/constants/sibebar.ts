import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  Users,
  UserRoundCog,
} from "lucide-react";

import type { UserRole } from "@/features/auth/types/role.type";

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ElementType;
  allowedRoles?: UserRole[];
}

export const navigation: NavigationItem[] = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Patients",
    path: "/patients",
    icon: Users,
    allowedRoles: ["admin", "receptionist"],
  },
  {
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
    allowedRoles: ["admin", "doctor", "receptionist"],
  },
  {
    label: "Staff",
    path: "/staff",
    icon: UserRoundCog,
    allowedRoles: ["admin"],
  },
  {
    label: "Clinic Settings",
    path: "/clinic-settings",
    icon: Settings,
    allowedRoles: ["admin"],
  },
];
