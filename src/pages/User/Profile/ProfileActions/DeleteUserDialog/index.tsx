import { Stack, Button, Typography } from "@mui/material";
import { UniversalDialog } from "../../../../../components";

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
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button onClick={onClose} sx={{ color: "white" }}>Cancel</Button>
          <Button
            onClick={onConfirm}
            color="error"
            variant="outlined"
            disabled={isPending}
          >
            Delete
          </Button>
        </Stack>
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
