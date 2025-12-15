import { useState } from "react";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useAuth } from "../../../context";
import { UserRole } from "../../../types";
import { useUsersInvite } from "../../../hooks";
import { UniversalDialog } from "../../UniversalDialog";

export function UserInviteForm() {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { user: self } = useAuth();
  const { mutateAsync: inviteUser, isPending } = useUsersInvite();
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
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={isPending || !email}
            >
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
          fullWidth
        />
      </UniversalDialog>
    </>
  );
}
