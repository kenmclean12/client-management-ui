import { Button, Typography } from "@mui/material";
import { UniversalDialog } from "../../../components";
import { dialogButtonStyles } from "../../../pages/styles";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  firstName?: string;
  lastName?: string;
}

export function DeleteUserDialog({
  open,
  onClose,
  onConfirm,
  isPending,
  firstName,
  lastName,
}: Props) {
  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Delete User"
      footer={
        <Button
          onClick={onConfirm}
          variant="outlined"
          sx={dialogButtonStyles}
          disabled={isPending}
        >
          Delete
        </Button>
      }
    >
      <Typography color="white">
        Are you sure you want to delete{" "}
        <strong>
          {firstName} {lastName}
        </strong>
        ? This action cannot be undone.
      </Typography>
    </UniversalDialog>
  );
}
