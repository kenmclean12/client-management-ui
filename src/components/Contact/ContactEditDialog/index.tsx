import { useState } from "react";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { UniversalDialog } from "../../../components";
import { useContactsUpdate } from "../../../hooks";
import { Contact, ContactUpdateDto, UserRole } from "../../../types";
import { dialogButtonStyles, textFieldStyles } from "../../../pages/styles";
import { useAuth } from "../../../context";

interface Props {
  contact: Contact;
}

export function ContactEditDialog({ contact }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const { mutateAsync: update } = useContactsUpdate(contact.id);
  const isAdmin = user?.role === UserRole.Admin;

  const handleOpen = () => {
    setName(contact.name ?? "");
    setEmail(contact.email ?? "");
    setPhone(contact.phone ?? "");
    setOpen(true);
  };

  const handleSave = async () => {
    const dto: ContactUpdateDto = {
      name,
      email,
      phone,
      clientId: contact.clientId,
    };

    await update({ id: contact.id, dto });
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{ color: "#aaa" }}
        disabled={!isAdmin}
      >
        <Edit />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={handleOpen}
        title="Edit Contact"
        footer={
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={dialogButtonStyles}
            fullWidth
          >
            Save
          </Button>
        }
      >
        <Stack spacing={2.5}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            inputProps={{ maxLength: 100 }}
            size="small"
            sx={textFieldStyles}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{ maxLength: 100 }}
            size="small"
            sx={textFieldStyles}
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputProps={{ maxLength: 20 }}
            size="small"
            sx={textFieldStyles}
          />
        </Stack>
      </UniversalDialog>
    </>
  );
}
