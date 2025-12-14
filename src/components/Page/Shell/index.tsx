import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { PageTopBar } from "../TopBar";

type PageShellProps = {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({
  title,
  icon,
  actions,
  children,
}: PageShellProps) {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
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
