import { useNavigate, useLocation } from "react-router-dom";
import { Stack, Typography, Box } from "@mui/material";
import { UserRole } from "../../types";
import { ClientSearchSection, UserSearchSection } from "../../components";
import { useAuth } from "../../context";
import { boxStyles, mainContainerStyles } from "./styles";
import { navItems } from "./config";

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
      <Stack mx={1}>
        {isUsersPage && <UserSearchSection />}
        {isClientsPage && <ClientSearchSection />}
      </Stack>
    </Stack>
  );
}
