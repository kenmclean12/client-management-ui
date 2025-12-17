import { useState } from "react";
import { Button, IconButton, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { UniversalDialog } from "../../../components";
import { useContactsDelete } from "../../../hooks";
import { dialogButtonStyles } from "../../../pages/styles";
import { useAuth } from "../../../context";
import { UserRole } from "../../../types";

interface Props {
  clientId: number;
  contactId: number;
  contactName: string;
}

export function ContactDeleteDialog({
  clientId,
  contactId,
  contactName,
}: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync: deleteContact } = useContactsDelete(clientId);
  const isAdmin = user?.role === UserRole.Admin;

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{ color: "#f55" }}
        disabled={!isAdmin}
      >
        <Delete />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Contact"
        footer={
          <Button
            variant="outlined"
            sx={dialogButtonStyles}
            onClick={() => deleteContact(contactId)}
          >
            Delete
          </Button>
        }
      >
        <Typography>
          Are you sure you want to delete{" "}
          {contactName ? `${contactName} from contacts?` : "this contact?"}
        </Typography>
      </UniversalDialog>
    </>
  );
}
