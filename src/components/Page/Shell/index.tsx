import { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { PageTopBar } from "../TopBar";
import { mainContainerStyles } from "./styles";

type Props = {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, icon, actions, children }: Props) {
  return (
    <Box sx={mainContainerStyles}>
      <PageTopBar
        title={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography>{title}</Typography>
            {icon}
          </Stack>
        }
        actions={actions}
      />
      {children}
    </Box>
  );
}
