import { useState } from "react";
import { Button, TextField, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { UniversalDialog } from "../../../components";
import { useClientsCreate } from "../../../hooks";
import { UserRole, type ClientCreateDto } from "../../../types";
import { useAuth } from "../../../context";
import { CLIENT_FIELD_ROWS, CLIENT_FIELDS, emptyForm } from "../config";

export default function ClientAddDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<ClientCreateDto>(emptyForm);
  const isAdmin = user?.role === UserRole.Admin;
  const { mutateAsync: create } = useClientsCreate();

  const handleChange =
    (field: keyof ClientCreateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev: ClientCreateDto) => ({
        ...prev,
        [field]: value === "" ? null : value,
      }));
    };

  const handleSubmit = async () => {
    await create(form);
    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={!isAdmin}>
        <Add />
      </Button>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add Client"
        footer={
          <Button variant="contained" onClick={handleSubmit}>
            Add Client
          </Button>
        }
      >
        <Stack spacing={2}>
          {CLIENT_FIELDS.map(({ key, label, required, type, autoFocus }) => (
            <TextField
              key={key}
              label={label}
              value={(form[key] ?? "") as string}
              onChange={handleChange(key)}
              required={required}
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
