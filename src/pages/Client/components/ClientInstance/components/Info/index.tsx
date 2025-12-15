import { Stack, Typography, Box, Divider, Paper } from "@mui/material";
import { Phone, Email, LocationOn } from "@mui/icons-material";
import { Client } from "../../../../../../types";
import { ClientNotes } from "./Notes";
import { ClientEditDialog } from "../../../../../../components/Client/ClientEditForm";
import { InfoBlock } from "./InfoBlock";
import { titleStyles, topRowBoxStyles } from "./styles";
import { ClientAddressMap } from "./Map";

interface Props {
  client: Client;
}

export function ClientInfo({ client }: Props) {
  return (
    <Paper sx={{ p: 4, m: 2, border: "1px solid lightgrey", borderRadius: 2 }}>
      <Box sx={topRowBoxStyles}>
        <Typography variant="h5" fontWeight={600} sx={titleStyles}>
          {client.name}
        </Typography>
        <ClientEditDialog client={client} />
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
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
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }}>
          <ClientAddressMap client={client} />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <ClientNotes clientId={client.id} />
    </Paper>
  );
}
