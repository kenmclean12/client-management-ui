import { Stack, Avatar, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import type { ReactNode } from "react";

type PlaceholderType = "user" | "client";

interface PlaceholderConfig {
  icon: ReactNode;
  text: string;
}

const PLACEHOLDER_CONFIG: Record<PlaceholderType, PlaceholderConfig> = {
  user: {
    icon: <PersonIcon sx={{ fontSize: 60 }} />,
    text: "Select a user from the side panel",
  },
  client: {
    icon: <PublicIcon sx={{ fontSize: 60 }} />,
    text: "Select a client from the side panel",
  },
};

interface PagePlaceholderProps {
  type: PlaceholderType;
  textOverride?: string;
}

export function PagePlaceholder({
  type,
  textOverride,
}: PagePlaceholderProps) {
  const config = PLACEHOLDER_CONFIG[type];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Stack
        spacing={3}
        alignItems="center"
        sx={{
          p: 4,
          textAlign: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: "grey.400",
          }}
        >
          {config.icon}
        </Avatar>

        <Typography variant="h6" color="grey" fontWeight="medium">
          {textOverride ?? config.text}
        </Typography>
      </Stack>
    </Box>
  );
}
