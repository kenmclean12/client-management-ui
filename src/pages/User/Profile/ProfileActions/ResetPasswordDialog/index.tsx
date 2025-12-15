import { Stack, Button, TextField } from "@mui/material";
import { UniversalDialog } from "../../../../../components";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  currentPassword: string;
  newPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
}

export function ResetPasswordDialog({
  open,
  onClose,
  onConfirm,
  isPending,
  currentPassword,
  newPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
}: Props) {
  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Reset Password"
      footer={
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} variant="contained" disabled={isPending}>
            {isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <TextField
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => onCurrentPasswordChange(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          size="small"
          fullWidth
        />
      </Stack>
    </UniversalDialog>
  );
}
