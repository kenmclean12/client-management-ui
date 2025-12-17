import { useState } from "react";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { UniversalDialog } from "../../../components";
import { useContactsCreate } from "../../../hooks";
import { ContactCreateDto, UserRole } from "../../../types";
import { dialogButtonStyles, textFieldStyles } from "../../../pages/styles";
import { useAuth } from "../../../context";

interface Props {
  clientId: number;
}

export function ContactAddDialog({ clientId }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const { mutateAsync: create } = useContactsCreate(clientId);
  const isAdmin = user?.role === UserRole.Admin;
  const isStandard = user?.role === UserRole.Standard;

  const handleCreate = async () => {
    const dto: ContactCreateDto = {
      name,
      email,
      phone,
      clientId: clientId,
    };

    await create(dto);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setEmail("");
    setPhone("");
  };

  const isValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0;

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{ color: "white", borderColor: "#666" }}
        disabled={!isAdmin && !isStandard}
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
            disabled={!isValid}
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
            onChange={() => setPhone("")}
            inputProps={{ maxLength: 20 }}
            size="small"
            sx={textFieldStyles}
          />
        </Stack>
      </UniversalDialog>
    </>
  );
}
