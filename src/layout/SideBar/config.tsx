import { PendingActions, People, Public, Work } from "@mui/icons-material";
import { ReactElement } from "react";
import { UserRole } from "../../types";

interface NavItem {
  label: string;
  icon: ReactElement;
  path: string;
  roles?: UserRole[];
}

export const navItems: NavItem[] = [
  {
    label: "Clients",
    icon: <Public />,
    path: "/clients",
  },
  {
    label: "Projects",
    icon: <Work />,
    path: "/projects",
    roles: [UserRole.Admin, UserRole.Standard],
  },
  {
    label: "Requests",
    icon: <PendingActions />,
    path: "/requests",
    roles: [UserRole.Admin],
  },
  { label: "Users", icon: <People />, path: "/users" },
];
