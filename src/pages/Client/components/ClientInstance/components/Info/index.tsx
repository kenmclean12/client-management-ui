import { Stack, Typography, Box, Divider, Paper } from "@mui/material";
import { Phone, Email, LocationOn } from "@mui/icons-material";
import { Client } from "../../../../../../types";
import { ClientNotes } from "./Notes";
import { ClientEditDialog } from "../../../../../../components/Client/ClientEditForm";
import { InfoBlock } from "./InfoBlock";
import { infoBoxStyles, titleStyles, topRowBoxStyles } from "./styles";

interface Props {
  client: Client;
}

export function ClientInfo({ client }: Props) {
  return (
    <Paper sx={{ p: 4, margin: 2, mt: 1, border: "1px solid lightgrey", borderRadius: 2 }}>
      <Box sx={topRowBoxStyles}>
        <Typography variant="h5" fontWeight={600} sx={titleStyles}>
          {client.name}
        </Typography>
        <ClientEditDialog client={client} />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={infoBoxStyles}>
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
      <Divider sx={{ my: 2 }} />
      <ClientNotes clientId={client.id} />
    </Paper>
  );
}
