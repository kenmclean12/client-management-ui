import { useState } from "react";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useAuth } from "../../../context";
import { UserRole } from "../../../types";
import { useUsersInvite } from "../../../hooks";
import { UniversalDialog } from "../../UniversalDialog";
import { textFieldStyles } from "../../../pages/styles";

export function UserInviteForm() {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { user: self } = useAuth();
  const { mutateAsync: inviteUser } = useUsersInvite();
  const isAdmin = self?.role === UserRole.Admin;

  const handleSend = async () => {
    if (!email.trim()) return;
    await inviteUser({ email });
    setEmail("");
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} disabled={!isAdmin}>
        <Send sx={{ color: "white" }} />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Invite User"
        footer={
          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button onClick={() => setOpen(false)} sx={{ color: "white" }}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={handleSend} disabled={!email}>
              Send
            </Button>
          </Stack>
        }
      >
        <TextField
          label="Email address"
          type="email"
          value={email}
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
          sx={textFieldStyles}
          size="small"
          fullWidth
        />
      </UniversalDialog>
    </>
  );
}
