import { useNavigate } from "react-router-dom";
import { Stack, Typography, Avatar } from "@mui/material";
import { PopoverMenu, PopoverMenuItem } from "../../components";
import {
  avatarStyles,
  innerContainerStyles,
  mainContainerStyles,
} from "./styles";
import { useAuth } from "../../context";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Stack sx={mainContainerStyles}>
      <Stack onClick={() => navigate("/")} sx={innerContainerStyles}>
        <Typography fontSize={18} fontWeight={600}>
          Client Management
        </Typography>
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
