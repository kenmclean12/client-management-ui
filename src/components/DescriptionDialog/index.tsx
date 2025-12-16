import { Typography, Box } from "@mui/material";
import { UniversalDialog } from "../UniversalDialog";
import { boxStyles } from "./styles";

interface Props {
  open: boolean;
  title: string;
  description?: string | null;
  onClose: () => void;
}

export function DescriptionDialog({
  open,
  title,
  description,
  onClose,
}: Props) {
  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title={title}
    >
      <Box sx={boxStyles}>
        <Typography>
          {description?.trim() || "No description provided."}
        </Typography>
      </Box>
    </UniversalDialog>
  );
}
