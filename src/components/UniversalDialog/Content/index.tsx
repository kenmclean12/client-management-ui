import type { ReactNode } from "react";
import {
  DialogContent,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";

interface Props {
  display?: boolean;
  children: ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

export function Content({ display, children, loading, emptyMessage }: Props) {
  return (
    <DialogContent sx={{ padding: 0 }}>
      <Stack pt={1}>
        {loading && (
          <CircularProgress size={30} sx={{ p: 3, color: "lightblue" }} />
        )}
        {!loading && display && (
          <Stack p={1} pt={2}>
            {children}
          </Stack>
        )}
        {!loading && !display && (
          <Typography align="center" color="white" p={3}>
            {emptyMessage}
          </Typography>
        )}
      </Stack>
    </DialogContent>
  );
}
