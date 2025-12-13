import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useClientsGetById } from "../../../../hooks";
import { ClientContacts, ClientInfo, ClientProjects } from "./components";
import { PageShell } from "../../../../components";
import { Public } from "@mui/icons-material";
import ClientAddDialog from "../Forms/ClientAddForm";

export function ClientInstancePage() {
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
    <PageShell title="Clients" icon={<Public />} actions={<ClientAddDialog />}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 10, mb: 3 }}>
        <Tab label="Info" />
        <Tab label="Contacts" />
        <Tab label="Projects" />
      </Tabs>
      {tab === 0 && <ClientInfo client={client} />}
      {tab === 1 && <ClientContacts clientId={client.id} />}
      {tab === 2 && <ClientProjects clientId={client.id} />}
    </PageShell>
  );
}
