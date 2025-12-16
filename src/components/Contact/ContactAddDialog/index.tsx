import { useState } from "react";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { UniversalDialog } from "../../../components";
import { useContactsCreate } from "../../../hooks";
import { ContactCreateDto } from "../../../types";
import { dialogButtonStyles, textFieldStyles } from "../../../pages/styles";

interface Props {
  clientId: number;
}

export function ContactAddDialog({ clientId }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const { mutateAsync: create } = useContactsCreate(clientId);

  const handleClose = () => {
    setOpen(false);
    setName("");
    setEmail("");
    setPhone("");
  };

  const handleCreate = async () => {
    const dto: ContactCreateDto = {
      name,
      email,
      phone,
      clientId: clientId,
    };

    await create(dto);
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{ color: "white", borderColor: "#666" }}
      >
        <Add />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={handleClose}
        title="Add New Contact"
        footer={
          <Button
            variant="outlined"
            onClick={handleCreate}
            sx={dialogButtonStyles}
            fullWidth
          >
            Add
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
            onChange={() => setPhone("")}
            size="small"
            sx={textFieldStyles}
          />
        </Stack>
      </UniversalDialog>
    </>
  );
}
