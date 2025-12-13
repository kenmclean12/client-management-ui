/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Paper,
  Alert,
  Typography,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import { Client, ClientUpdateDto } from "../../../../../../types";
import { useClientsUpdate } from "../../../../../../hooks";

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

export function ClientInfo({ client }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<ClientUpdateDto>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useClientsUpdate(client.id);

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
      setError(null);
    };

  const handleSave = async () => {
    try {
      const changes: Partial<ClientUpdateDto> = {};

      (Object.keys(form) as (keyof ClientUpdateDto)[]).forEach((key) => {
        if (form[key] !== (client as any)[key]) {
          changes[key] = form[key];
        }
      });

      if (Object.keys(changes).length === 0) {
        setEditMode(false);
        return;
      }

      await updateMutation.mutateAsync({
        id: client.id,
        dto: changes as ClientUpdateDto,
      });

      setEditMode(false);
    } catch (err: any) {
      setError(err.message || "Failed to update client");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
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
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={2}>
        <Typography variant="h6">Client Information</Typography>

        <TextField
          label="Name"
          value={form.name}
          onChange={handleChange("name")}
          disabled={!editMode}
          required
        />

        <TextField
          label="Email"
          value={form.email}
          onChange={handleChange("email")}
          disabled={!editMode}
          type="email"
          required
        />

        <TextField
          label="Phone"
          value={form.phoneNumber ?? ""}
          onChange={handleChange("phoneNumber")}
          disabled={!editMode}
        />

        <TextField
          label="Address"
          value={form.address ?? ""}
          onChange={handleChange("address")}
          disabled={!editMode}
        />

        <Stack direction="row" spacing={2}>
          <TextField
            label="City"
            value={form.city ?? ""}
            onChange={handleChange("city")}
            disabled={!editMode}
            fullWidth
          />
          <TextField
            label="State"
            value={form.state ?? ""}
            onChange={handleChange("state")}
            disabled={!editMode}
            fullWidth
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Zip Code"
            value={form.zipCode ?? ""}
            onChange={handleChange("zipCode")}
            disabled={!editMode}
            fullWidth
          />
          <TextField
            label="Country"
            value={form.country ?? ""}
            onChange={handleChange("country")}
            disabled={!editMode}
            fullWidth
          />
        </Stack>

        {!editMode && (
          <Button onClick={() => setEditMode(true)} variant="outlined">
            Edit Client
          </Button>
        )}

        {editMode && (
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button startIcon={<Cancel />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              Save
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
