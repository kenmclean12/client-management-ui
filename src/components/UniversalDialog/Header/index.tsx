import { DialogTitle, IconButton, Stack } from "@mui/material";
import { Close } from "@mui/icons-material";
import { closeIconStyles, dialogTitleStyles } from "./styles";

interface Props {
  title: string;
  onClose: () => void;
  extraAction?: React.ReactNode;
}

export default function Header({ title, onClose, extraAction }: Props) {
  return (
    <DialogTitle sx={dialogTitleStyles}>
      {title}
      <Stack
        direction="row"
        spacing={1}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        {extraAction}
        <IconButton onClick={onClose} sx={closeIconStyles}>
          <Close />
        </IconButton>
      </Stack>
    </DialogTitle>
  );
}
