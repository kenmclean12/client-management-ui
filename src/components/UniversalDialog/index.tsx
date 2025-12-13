import type { ReactNode } from "react";
import { Dialog, Stack } from "@mui/material";
import Header from "./Header";
import { Content } from "./Content";
import { dialogStyles } from "./styles";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  hasContent?: boolean;
  emptyMessage?: string;
  maxWidth?: "sm" | "md" | "lg";
}

export function UniversalDialog({
  open,
  onClose,
  title = "",
  children,
  footer,
  loading = false,
  hasContent = true,
  emptyMessage = "No content found",
  maxWidth = "sm",
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          ...dialogStyles,
          height: maxWidth === "lg" ? "90vh" : "auto",
        },
      }}
    >
      {title && <Header title={title} onClose={onClose} />}
      <Content
        display={hasContent}
        loading={loading}
        emptyMessage={emptyMessage}
      >
        <Stack paddingInline={1} paddingBottom={footer ? 0 : 1.5}>
          {children}
        </Stack>
      </Content>
      {footer && (
        <Stack mt={2.5} p={1.5} paddingInline={0} borderTop="1px solid #444">
          <Stack paddingInline={1}>{footer}</Stack>
        </Stack>
      )}
    </Dialog>
  );
}
