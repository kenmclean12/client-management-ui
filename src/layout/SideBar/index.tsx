import { Stack, Typography, Box, Divider } from "@mui/material";
import { People, AdminPanelSettings, Public } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ReactElement } from "react";
import { useAuth } from "../../context/authContext";

interface NavItem {
  label: string;
  icon: ReactElement;
  path: string;
  roles?: string[];
}

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { label: "Clients", icon: <Public />, path: "/clients" },
    { label: "Users", icon: <People />, path: "/users", 
        // roles: ["ADMIN"] 
    },
    { label: "Admin", icon: <AdminPanelSettings />, path: "/admin", 
        // roles: ["ADMIN"] 
    },
  ];

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
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Navigation
      </Typography>

      {navItems.map((item) => {
        if (item.roles && !item.roles.includes(user?.role ?? "")) return null;

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
              "&:hover": {
                backgroundColor: "#222",
              },
            }}
          >
            {item.icon}
            <Typography fontSize={14}>{item.label}</Typography>
          </Box>
        );
      })}

      <Divider sx={{ borderColor: "#333", my: 1 }} />

      {/* You could add more sections here if needed */}
    </Stack>
  );
}
