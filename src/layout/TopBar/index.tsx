import { useNavigate } from "react-router-dom";
import { Stack, Typography, Avatar } from "@mui/material";
import { Public } from "@mui/icons-material";
import { PopoverMenu, PopoverMenuItem } from "../../components";
import { avatarStyles, mainContainerStyles } from "./styles";
import { useAuth } from "../../context";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Stack sx={mainContainerStyles}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography fontSize={20} fontWeight={600}>
          Client Management
        </Typography>
        <Public sx={{ color: "lightblue" }} />
      </Stack>
      <PopoverMenu
        trigger={
          <Avatar src={user?.avatarUrl ?? undefined} sx={avatarStyles} />
        }
      >
        <PopoverMenuItem
          label="Profile"
          closeOnSelect
          onClick={() => navigate(`/users/${user?.id as number}`)}
        />
        <PopoverMenuItem
          label="Logout"
          closeOnSelect
          onClick={() => logout()}
        />
      </PopoverMenu>
    </Stack>
  );
}
