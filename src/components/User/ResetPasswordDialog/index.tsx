import { useState } from "react";
import { Stack, Button, TextField } from "@mui/material";
import { UniversalDialog } from "../../UniversalDialog";
import { dialogButtonStyles, textFieldStyles } from "../../../pages/styles";
import { useUsersResetPassword } from "../../../hooks";

interface Props {
  userId: number;
  open: boolean;
  onClose: () => void;
}

export function ResetPasswordDialog({ userId, open, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const { mutateAsync: reset } = useUsersResetPassword(userId);

  const handleResetPassword = async () => {
    await reset({
      id: userId,
      dto: {
        password: currentPassword,
        newPassword,
      },
    });

    setCurrentPassword("");
    setNewPassword("");
    onClose();
  };

  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Reset Password"
      footer={
        <Button
          onClick={handleResetPassword}
          variant="outlined"
          sx={dialogButtonStyles}
          disabled={!currentPassword || !newPassword}
        >
          Reset
        </Button>
      }
    >
      <Stack spacing={2}>
        <TextField
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          size="small"
          fullWidth
          sx={textFieldStyles}
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          size="small"
          fullWidth
          sx={textFieldStyles}
        />
      </Stack>
    </UniversalDialog>
  );
}
