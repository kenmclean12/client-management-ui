import { Typography, Box, Button } from "@mui/material";
import { UniversalDialog } from "../../UniversalDialog";
import { dialogButtonStyles } from "../../../pages/styles";
import { boxStyles } from "./styles";

interface Props {
  open: boolean;
  title: string;
  description?: string | null;
  onClose: () => void;
}

export function RequestDescriptionDialog({
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
      footer={
        <Button variant="outlined" onClick={onClose} sx={dialogButtonStyles}>
          Close
        </Button>
      }
    >
      <Box sx={boxStyles}>
        <Typography>
          {description?.trim() || "No description provided."}
        </Typography>
      </Box>
    </UniversalDialog>
  );
}
