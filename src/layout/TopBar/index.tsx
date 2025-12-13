import { Stack, Typography, Avatar } from "@mui/material";
import { Public } from "@mui/icons-material";
import { useAuth } from "../../context/authContext";
import { PopoverMenu, PopoverMenuItem } from "../../components";
export default function TopBar() {
  const { user, logout } = useAuth();

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
        <Public sx={{ color: "lightblue" }} />
        <Typography fontSize={20} fontWeight={600}>
          Client Management
        </Typography>
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
            console.log("Go to profile");
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
