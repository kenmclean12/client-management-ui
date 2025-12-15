/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Button, Stack, TextField, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { UniversalDialog } from "../../../components";
import { Client, ClientUpdateDto } from "../../../types";
import { useClientsUpdate } from "../../../hooks";
import { CLIENT_FIELD_ROWS, CLIENT_FIELDS } from "../config";
import { textFieldStyles } from "../../../pages/styles";

interface Props {
  client: Client;
}

const emptyForm: ClientUpdateDto = {
  name: "",
  email: "",
  phoneNumber: null,
  address: null,
  city: null,
  state: null,
  zipCode: null,
  country: null,
};

export function ClientEditDialog({ client }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<ClientUpdateDto>(emptyForm);
  const { mutateAsync: update, isPending } = useClientsUpdate(client.id);

  useEffect(() => {
    setForm({
      name: client.name,
      email: client.email,
      phoneNumber: client.phoneNumber,
      address: client.address,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      country: client.country,
    });
  }, [client]);

  const handleChange =
    (field: keyof ClientUpdateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((p) => ({ ...p, [field]: value === "" ? null : value }));
    };

  const handleSave = async () => {
    const changes: Partial<ClientUpdateDto> = {};

    (Object.keys(form) as (keyof ClientUpdateDto)[]).forEach((key) => {
      if (form[key] !== client[key]) {
        changes[key] = form[key];
      }
    });

    if (Object.keys(changes).length === 0) {
      setOpen(false);
      return;
    }

    await update({ id: client.id, dto: changes as ClientUpdateDto });
    setOpen(false);
  };

  return (
    <>
      <Edit
        onClick={() => setOpen(true)}
        sx={{ color: "white", cursor: "pointer" }}
      />
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Client"
        footer={
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={{ mx: 2, color: "white", border: "1px solid #444" }}
            disabled={isPending}
          >
            Save
          </Button>
        }
      >
        <Stack spacing={2.5}>
          {CLIENT_FIELDS.map(({ key, label, required, type, autoFocus }) => (
            <TextField
              key={key}
              label={label}
              value={(form[key] ?? "") as string}
              onChange={handleChange(key)}
              required={required}
              size="small"
              sx={textFieldStyles}
              type={type}
              autoFocus={autoFocus}
              fullWidth
            />
          ))}
          {CLIENT_FIELD_ROWS.map((row, i) => (
            <Stack key={i} direction="row" spacing={2}>
              {row.map(({ key, label }) => (
                <TextField
                  key={key}
                  size="small"
                  sx={textFieldStyles}
                  label={label}
                  value={(form[key] ?? "") as string}
                  onChange={handleChange(key)}
                  fullWidth
                />
              ))}
            </Stack>
          ))}
        </Stack>
      </UniversalDialog>
    </>
  );
}
