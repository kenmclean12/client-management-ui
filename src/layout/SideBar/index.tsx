import { ReactElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Stack, Typography, Box } from "@mui/material";
import { PendingActions, People, Public, Work } from "@mui/icons-material";
import { UserRole } from "../../types";
import { ClientSearchSection, UserSearchSection } from "../../components";
import { useAuth } from "../../context";
import { boxStyles, mainContainerStyles } from "./styles";

interface NavItem {
  label: string;
  icon: ReactElement;
  path: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
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

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isUsersPage = location.pathname.startsWith("/users");
  const isClientsPage = location.pathname.startsWith("/clients");
  const userRole = user?.role as UserRole;

  return (
    <Stack sx={mainContainerStyles}>
      {navItems.map((item) => {
        if (item.roles && !item.roles.includes(userRole)) return null;
        return (
          <Box
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={boxStyles}
          >
            {item.icon}
            <Typography fontSize={14}>{item.label}</Typography>
          </Box>
        );
      })}
      {isUsersPage && <UserSearchSection />}
      {isClientsPage && <ClientSearchSection />}
    </Stack>
  );
}
