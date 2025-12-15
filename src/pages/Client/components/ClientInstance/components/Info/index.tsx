import {
  Stack,
  Typography,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import { Phone, Email, LocationOn } from "@mui/icons-material";
import { Client } from "../../../../../../types";
import { ClientNotes } from "./Notes";
import { ClientEditDialog } from "../../../../../../components/Client/ClientEditForm";

interface Props {
  client: Client;
}

export function ClientInfo({ client }: Props) {
  return (
    <Paper sx={{ p: 4, maxWidth: 900, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {client.name}
        </Typography>
        <ClientEditDialog client={client} />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Stack spacing={3}>
            <InfoBlock icon={<Email />} label="Email" value={client.email} />
            <InfoBlock
              icon={<Phone />}
              label="Phone"
              value={client.phoneNumber || "Not provided"}
            />
          </Stack>
        </Box>
        <Box sx={{ flex: 1 }}>
          <InfoBlock
            icon={<LocationOn />}
            label="Address"
            value={
              client.address
                ? [
                    client.address,
                    [client.city, client.state, client.zipCode]
                      .filter(Boolean)
                      .join(", "),
                    client.country,
                  ]
                    .filter(Boolean)
                    .join("\n")
                : "No address provided"
            }
            multiline
          />
        </Box>
      </Box>
      <ClientNotes clientId={client.id} />
    </Paper>
  );
}

function InfoBlock({
  icon,
  label,
  value,
  multiline,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{ ml: 3, whiteSpace: multiline ? "pre-line" : "normal" }}
      >
        {value}
      </Typography>
    </Box>
  );
}
