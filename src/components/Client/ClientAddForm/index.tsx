import { useState } from "react";
import { Button, TextField, Stack, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { UniversalDialog } from "../../../components";
import { useClientsCreate } from "../../../hooks";
import { UserRole, type ClientCreateDto } from "../../../types";
import { useAuth } from "../../../context";
import { CLIENT_FIELD_ROWS, CLIENT_FIELDS, emptyForm } from "../config";
import { dialogButtonStyles, textFieldStyles } from "../../../pages/styles";

export default function ClientAddDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<ClientCreateDto>(emptyForm);
  const { mutateAsync: create } = useClientsCreate();
  const isAdmin = user?.role === UserRole.Admin;

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
      <IconButton onClick={() => setOpen(true)} disabled={!isAdmin}>
        <Add sx={{ color: "white" }} />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add Client"
        footer={
          <Button
            variant="outlined"
            onClick={handleSubmit}
            sx={dialogButtonStyles}
            disabled={!form.name || !form.email}
          >
            Add Client
          </Button>
        }
      >
        <Stack spacing={2}>
          {CLIENT_FIELDS.map(
            ({ key, label, maxLength, required, type, autoFocus }) => (
              <TextField
                key={key}
                label={label}
                value={(form[key] ?? "") as string}
                onChange={handleChange(key)}
                size="small"
                required={required}
                inputProps={{ maxLength }}
                type={type}
                autoFocus={autoFocus}
                sx={textFieldStyles}
                fullWidth
              />
            )
          )}
          {CLIENT_FIELD_ROWS.map((row, i) => (
            <Stack key={i} direction="row" spacing={2}>
              {row.map(({ key, label, maxLength }) => (
                <TextField
                  key={key}
                  label={label}
                  size="small"
                  inputProps={{ maxLength }}
                  value={(form[key] ?? "") as string}
                  onChange={handleChange(key)}
                  sx={textFieldStyles}
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
