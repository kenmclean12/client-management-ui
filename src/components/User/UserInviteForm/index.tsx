import { Send } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { UniversalDialog } from "../../UniversalDialog";

export function UserInviteForm() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <Send sx={{ color: "white" }} />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(!open)}
        title="User Invite"
        footer={
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button>Close</Button>
            <Button>Send</Button>
          </Stack>
        }
      >
        <p>Form content</p>
      </UniversalDialog>
    </>
  );
}
