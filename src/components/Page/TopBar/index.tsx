import type { ReactNode } from "react";
import { Box, Stack } from "@mui/material";

interface Props {
  title: ReactNode;
  actions?: ReactNode;
}

export function PageTopBar({ title, actions }: Props) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        width: "100%",
        px: 3,
        py: 2,
        borderBottom: "1px solid #222",
        backgroundColor: "#111",
        color: "white",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        {title}
        {actions && (
          <Stack direction="row" alignItems="center" gap={1}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
