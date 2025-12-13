import { useState } from "react";
import { Box, Tabs, Tab, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Business } from "@mui/icons-material";
import { PageShell } from "../../../../components";
import { useClientsGetById } from "../../../../hooks";
import { ClientContacts, ClientInfo, ClientProjects } from "./components";

export default function ClientInstancePage() {
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  const [tab, setTab] = useState(0);

  const { data: client, isLoading, error } = useClientsGetById(clientId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !client) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography color="error">Client not found</Typography>
      </Box>
    );
  }

  return (
    <PageShell title={client.name} icon={<Business />}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Info" />
        <Tab label="Projects" />
        <Tab label="Contacts" />
      </Tabs>

      {tab === 0 && <ClientInfo client={client} />}
      {tab === 1 && <ClientProjects />}
      {tab === 2 && <ClientContacts />}
    </PageShell>
  );
}
