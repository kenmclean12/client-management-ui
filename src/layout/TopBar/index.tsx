import { Stack, Typography, Avatar } from "@mui/material";
import { Public } from "@mui/icons-material";
import { useAuth } from "../../context/authContext";
import { PopoverMenu, PopoverMenuItem } from "../../components";
import { useNavigate } from "react-router-dom";
export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 3,
        py: 2,
        backgroundColor: "#111",
        color: "white",
        borderBottom: "1px solid #222",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography fontSize={20} fontWeight={600}>
          Project Management
        </Typography>
        <Public sx={{ color: "lightblue" }} />
      </Stack>
      <PopoverMenu
        trigger={
          <Avatar
            src={user?.avatarUrl ?? undefined}
            sx={{ width: 36, height: 36, cursor: "pointer" }}
          />
        }
      >
        <PopoverMenuItem
          label="Profile"
          closeOnSelect
          onClick={() => {
            navigate(`/users/${user?.id as number}`)
          }}
        />
        <PopoverMenuItem
          label="Logout"
          closeOnSelect
          onClick={() => {
            logout();
          }}
        />
      </PopoverMenu>
    </Stack>
  );
}
