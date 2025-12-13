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
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import { Save, Cancel, Edit, Phone, Email, LocationOn } from "@mui/icons-material";
import { Client, ClientUpdateDto } from "../../../../../../types";
import { useClientsUpdate } from "../../../../../../hooks";
import { ClientNotes } from "./Notes";

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

  const renderDisplayView = () => (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          {client.name}
        </Typography>
        <IconButton
          onClick={() => setEditMode(true)}
          color="primary"
          sx={{ border: 1, borderColor: "divider" }}
        >
          <Edit />
        </IconButton>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" },
        gap: 4 
      }}>
        {/* Contact Information Column */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={3}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Email color="action" fontSize="small" />
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 3 }}>
                {client.email}
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Phone color="action" fontSize="small" />
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 3 }}>
                {client.phoneNumber || "Not provided"}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Address Column */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={3}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <LocationOn color="action" fontSize="small" />
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
              </Box>
              {client.address ? (
                <Box sx={{ ml: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    {client.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[client.city, client.state, client.zipCode]
                      .filter(Boolean)
                      .join(", ")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {client.country}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ ml: 3 }}>
                  No address provided
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );

  const renderEditView = () => (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Edit Client Information</Typography>
      </Box>

      <Stack spacing={3}>
        {/* Name and Email in a row on desktop, stacked on mobile */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          gap: 2 
        }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange("name")}
            sx={{ flex: 1 }}
            required
            variant="outlined"
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            sx={{ flex: 1 }}
            type="email"
            required
            variant="outlined"
          />
        </Box>

        <TextField
          label="Phone Number"
          value={form.phoneNumber ?? ""}
          onChange={handleChange("phoneNumber")}
          fullWidth
          variant="outlined"
          placeholder="+1 (123) 456-7890"
        />

        <TextField
          label="Address"
          value={form.address ?? ""}
          onChange={handleChange("address")}
          fullWidth
          variant="outlined"
          multiline
          rows={2}
        />

        {/* City, State, Zip in a row on desktop, stacked on mobile */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          gap: 2 
        }}>
          <TextField
            label="City"
            value={form.city ?? ""}
            onChange={handleChange("city")}
            sx={{ flex: 1 }}
            variant="outlined"
          />
          <TextField
            label="State/Province"
            value={form.state ?? ""}
            onChange={handleChange("state")}
            sx={{ flex: 1 }}
            variant="outlined"
          />
          <TextField
            label="Zip/Postal Code"
            value={form.zipCode ?? ""}
            onChange={handleChange("zipCode")}
            sx={{ flex: 1 }}
            variant="outlined"
          />
        </Box>

        <TextField
          label="Country"
          value={form.country ?? ""}
          onChange={handleChange("country")}
          fullWidth
          variant="outlined"
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}>
          <Button
            startIcon={<Cancel />}
            onClick={handleCancel}
            variant="outlined"
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Stack>
    </>
  );

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 900,
        borderRadius: 2,
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {editMode ? renderEditView() : renderDisplayView()}
      <ClientNotes clientId={client.id} />
    </Paper>
  );
}