import { ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { PageTopBar } from "../TopBar";
import { mainContainerStyles, titleContainerStyles } from "./styles";

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
          <Stack sx={titleContainerStyles}>
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
