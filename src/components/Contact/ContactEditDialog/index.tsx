import { useState } from "react";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { UniversalDialog } from "../../../components";
import { useContactsUpdate } from "../../../hooks";
import { Contact, ContactUpdateDto } from "../../../types";
import { textFieldStyles } from "../../../pages/styles";

interface Props {
  contact: Contact;
}

export function ContactEditDialog({ contact }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(contact.name);
  const [email, setEmail] = useState<string>(contact.email);
  const [phone, setPhone] = useState<string>(contact.phone ?? "");
  const { mutateAsync: update } = useContactsUpdate(contact.id);

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
      <IconButton onClick={() => setOpen(true)} sx={{ color: "#aaa" }}>
        <Edit />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Contact"
        footer={
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={{ color: "white", borderColor: "#444" }}
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
            size="small"
            sx={textFieldStyles}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            sx={textFieldStyles}
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="small"
            sx={textFieldStyles}
          />
        </Stack>
      </UniversalDialog>
    </>
  );
}
