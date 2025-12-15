import { Stack, Avatar, Typography, Box } from "@mui/material";
import { Props } from "./types";
import { PLACEHOLDER_CONFIG } from "./config";
import {
  avatarStyles,
  contentContainerStyles,
  mainContainerStyles,
} from "./styles";

export function PagePlaceholder({ type, textOverride }: Props) {
  const config = PLACEHOLDER_CONFIG[type];

  return (
    <Box sx={mainContainerStyles}>
      <Stack sx={contentContainerStyles}>
        <Avatar sx={avatarStyles}>{config.icon}</Avatar>
        <Typography variant="h6" color="grey" fontWeight="medium">
          {textOverride ?? config.text}
        </Typography>
      </Stack>
    </Box>
  );
}
