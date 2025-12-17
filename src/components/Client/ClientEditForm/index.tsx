/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, IconButton, Stack, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { UniversalDialog } from "../../../components";
import { Client, ClientUpdateDto, UserRole } from "../../../types";
import { useClientsUpdate } from "../../../hooks";
import { CLIENT_FIELD_ROWS, CLIENT_FIELDS } from "../config";
import { dialogButtonStyles, textFieldStyles } from "../../../pages/styles";
import { clientToForm, emptyForm, hasClientChanges } from "./config";
import { useAuth } from "../../../context";

interface Props {
  client: Client;
}

export function ClientEditDialog({ client }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<ClientUpdateDto>(emptyForm);
  const { mutateAsync: update } = useClientsUpdate(client.id);
  const isAdmin = user?.role === UserRole.Admin;
  const isDirty = hasClientChanges(form, client);

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
        changes[key] = form[key] as any;
      }
    });

    if (Object.keys(changes).length === 0) {
      setOpen(false);
      return;
    }

    await update({ id: client.id, dto: changes as ClientUpdateDto });
    setForm(emptyForm);
    setOpen(false);
  };

  const handleOpen = () => {
    setForm(clientToForm(client));
    setOpen(true);
  };

  return (
    <>
      <IconButton onClick={handleOpen} disabled={!isAdmin}>
        <Edit sx={{ color: "white" }} />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Client"
        footer={
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={dialogButtonStyles}
            disabled={!isDirty}
          >
            Save
          </Button>
        }
      >
        <Stack spacing={2.5}>
          {CLIENT_FIELDS.map(
            ({ key, label, maxLength, required, type, autoFocus }) => (
              <TextField
                key={key}
                label={label}
                value={(form[key] ?? "") as string}
                onChange={handleChange(key)}
                required={required}
                inputProps={{ maxLength }}
                size="small"
                sx={textFieldStyles}
                type={type}
                autoFocus={autoFocus}
                fullWidth
              />
            )
          )}
          {CLIENT_FIELD_ROWS.map((row, i) => (
            <Stack key={i} direction="row" spacing={2}>
              {row.map(({ key, label, maxLength }) => (
                <TextField
                  key={key}
                  size="small"
                  sx={textFieldStyles}
                  inputProps={{ maxLength }}
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
