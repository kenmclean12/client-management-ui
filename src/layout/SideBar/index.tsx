import { ReactElement } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PendingActions,
  People,
  Public,
  Work,
} from "@mui/icons-material";
import { UserRole } from "../../types";
import { ClientSearchSection, UserSearchSection } from "../../components";
import { useAuth } from "../../context";
interface NavItem {
  label: string;
  icon: ReactElement;
  path: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Clients", icon: <Public />, path: "/clients" },
  { label: "Projects", icon: <Work />, path: "/projects" },
  { label: "Requests", icon: <PendingActions />, path: "/requests" },
  { label: "Users", icon: <People />, path: "/users" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isUsersPage = location.pathname.startsWith("/users");
  const isClientsPage = location.pathname.startsWith("/clients");

  return (
    <Stack
      sx={{
        width: "220px",
        height: "100vh",
        backgroundColor: "#111",
        color: "white",
        py: 3,
        px: 2,
        borderRight: "1px solid #222",
        gap: 1.5,
        overflowY: "auto",
      }}
    >
      {navItems.map((item) => {
        if (item.roles && !item.roles.includes(user?.role as UserRole)) return null;
        return (
          <Box
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 1,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#222" },
            }}
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
