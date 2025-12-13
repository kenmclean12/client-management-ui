import type { ReactNode } from "react";
import { Avatar, Paper, Stack, Typography, Tooltip } from "@mui/material";
import { contentContainerStyles, paperStyles } from "./styles";
import { UserResponseDto } from "../../../types";

interface Props {
  user: UserResponseDto;
  showUserName?: boolean;
  button?: ReactNode;
  message?: string;
  color?: string;
  hoverColor?: string;
  onClick?: (id: number) => void;
}

export function UserRow({
  user,
  showUserName = false,
  button,
  message,
  color,
  hoverColor,
  onClick,
}: Props) {
  const fullName = message || `${user.firstName} ${user.lastName}`;

  return (
    <Paper
      sx={{
        ...paperStyles,
        backgroundColor: color ?? "black",
        "&:hover": {
          backgroundColor: hoverColor ?? "#101",
        },
      }}
      onClick={() => onClick?.(user.id)}
    >
      <Stack sx={contentContainerStyles}>
        <Avatar src={user.avatarUrl} sx={{ width: 30, height: 30 }} />
        <Tooltip title={fullName}>
          <Typography
            color="white"
            fontSize={message ? "13px" : "14px"}
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            noWrap
          >
            {fullName} {showUserName && `(@${user.userName})`}
          </Typography>
        </Tooltip>
      </Stack>
      {button && <>{button}</>}
    </Paper>
  );
}
