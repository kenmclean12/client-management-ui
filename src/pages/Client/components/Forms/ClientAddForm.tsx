import { useState } from "react";
import { Button, TextField, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { UniversalDialog } from "../../../../components";
import { useClientsCreate } from "../../../../hooks";
import type { ClientCreateDto } from "../../../../types";

const emptyForm: ClientCreateDto = {
  name: "",
  email: "",
  phoneNumber: null,
  address: null,
  city: null,
  state: null,
  zipCode: null,
  country: null,
};

export default function ClientAddDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ClientCreateDto>(emptyForm);

  const createMutation = useClientsCreate();

  const handleChange =
    (field: keyof ClientCreateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value === "" ? null : value,
      }));
    };

  const handleSubmit = async () => {
    await createMutation.mutateAsync(form);
    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <>
      {/* 🔘 Icon-only trigger */}
      <Button onClick={() => setOpen(true)}>
        <Add />
      </Button>

      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add Client"
        loading={createMutation.isPending}
        footer={
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            Add Client
          </Button>
        }
      >
        <Stack spacing={2}>
          <TextField
            label="Client Name"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            type="email"
            fullWidth
            required
          />

          <TextField
            label="Phone Number"
            value={form.phoneNumber ?? ""}
            onChange={handleChange("phoneNumber")}
            fullWidth
          />

          <TextField
            label="Address"
            value={form.address ?? ""}
            onChange={handleChange("address")}
            fullWidth
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="City"
              value={form.city ?? ""}
              onChange={handleChange("city")}
              fullWidth
            />
            <TextField
              label="State"
              value={form.state ?? ""}
              onChange={handleChange("state")}
              fullWidth
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Zip Code"
              value={form.zipCode ?? ""}
              onChange={handleChange("zipCode")}
              fullWidth
            />
            <TextField
              label="Country"
              value={form.country ?? ""}
              onChange={handleChange("country")}
              fullWidth
            />
          </Stack>
        </Stack>
      </UniversalDialog>
    </>
  );
}
