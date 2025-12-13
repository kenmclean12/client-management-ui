/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Stack, Typography, Box, Divider, Input } from "@mui/material";
import {
  People,
  AdminPanelSettings,
  Public,
  Search,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactElement, useState } from "react";
import { useAuth } from "../../context/authContext";
import { UserRole, UserResponseDto } from "../../types";
import { useUsersGetAll } from "../../hooks";
import { UserRow } from "../../components";
interface NavItem {
  label: string;
  icon: ReactElement;
  path: string;
  roles?: UserRole[];
}

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const usersQuery = useUsersGetAll({
    enabled: location.pathname === "/users",
  });
  const users = usersQuery.data ?? [];

  const navItems: NavItem[] = [
    { label: "Clients", icon: <Public />, path: "/clients" },
    {
      label: "Users",
      icon: <People />,
      path: "/users",
      // roles: [UserRole.ADMIN]
    },
    {
      label: "Admin",
      icon: <AdminPanelSettings />,
      path: "/admin",
      //  roles: [UserRole.ADMIN]
    },
  ];

  const filteredUsers = users?.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.userName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack
      direction="column"
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Navigation
      </Typography>

      {navItems.map((item) => {
        if (item.roles && !item.roles.includes(user?.role!)) return null;

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
      {location.pathname === "/users" && (
        <>
          <Divider sx={{ borderColor: "#333", my: 1 }} />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={<Search sx={{ color: "#888", mr: 1 }} />}
            sx={{
              color: "white",
              fontSize: 13,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: "#362c2cff",
            }}
            fullWidth
          />
          <Stack gap={0.5} mt={1}>
            {filteredUsers?.map((u: UserResponseDto) => (
              <UserRow
                key={u.id}
                user={u}
                showUserName
                onClick={() => navigate(`/users/${u.id}`)}
                hoverColor="#222"
                color="#111"
              />
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
}
