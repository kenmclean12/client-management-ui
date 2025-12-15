import { Box, Typography } from "@mui/material";
import { Client } from "../../../../../../../types";
import { boxStyles, noAddressBoxStyles } from "./styles";

interface Props {
  client: Client;
}

export function ClientAddressMap({ client }: Props) {
  const addressParts = [
    client.address,
    client.city,
    client.state,
    client.zipCode,
    client.country,
  ].filter(Boolean);
  const addressQuery = encodeURIComponent(addressParts.join(", "));

  if (addressParts.length === 0) {
    return (
      <Box sx={noAddressBoxStyles}>
        <Typography color="text.secondary">No address available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={boxStyles}>
      <iframe
        title="Client location"
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${addressQuery}&output=embed`}
        style={{ border: 0 }}
      />
    </Box>
  );
}
