import type { ReactNode } from "react";
import { Box, Stack } from "@mui/material";
import {
  actionsContainerStyles,
  mainContainerStyles,
  rowContainerStyles,
} from "./styles";

interface Props {
  title: ReactNode;
  actions?: ReactNode;
}

export function PageTopBar({ title, actions }: Props) {
  return (
    <Box sx={mainContainerStyles}>
      <Stack sx={rowContainerStyles}>
        {title}
        {actions && <Stack sx={actionsContainerStyles}>{actions}</Stack>}
      </Stack>
    </Box>
  );
}
