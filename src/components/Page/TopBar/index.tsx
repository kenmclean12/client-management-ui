import type { ReactNode } from "react";
import { Box, Stack } from "@mui/material";
import { mainContainerStyles } from "./styles";

interface Props {
  title: ReactNode;
  actions?: ReactNode;
}

export function PageTopBar({ title, actions }: Props) {
  return (
    <Box sx={mainContainerStyles}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
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
