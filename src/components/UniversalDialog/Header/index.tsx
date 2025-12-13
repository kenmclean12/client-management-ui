import { DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { closeIconStyles, dialogTitleStyles } from "./styles";

interface Props {
  title: string;
  onClose: () => void;
}

export default function Header({ title, onClose }: Props) {
  return (
    <DialogTitle sx={dialogTitleStyles}>
      {title}
      <IconButton onClick={onClose} sx={closeIconStyles}>
        <Close />
      </IconButton>
    </DialogTitle>
  );
}
