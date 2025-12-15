import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { useParams } from "react-router-dom";
import { useClientsGetById } from "../../../../hooks";
import { ClientContacts, ClientInfo, ClientProjects } from "./components";
import { PageShell } from "../../../../components";
import { Public } from "@mui/icons-material";
import ClientAddDialog from "../../../../components/Client/ClientAddForm";

enum ClientTab {
  Info = 0,
  Contacts = 1,
  Projects = 2,
}

export function ClientInstancePage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<number>(ClientTab.Info);
  const { data: client } = useClientsGetById(Number(id));

  return (
    <PageShell title="Clients" icon={<Public />} actions={<ClientAddDialog />}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 10, mb: 3 }}>
        <Tab label="Info" />
        <Tab label="Contacts" />
        <Tab label="Projects" />
      </Tabs>
      {client && (
        <>
          {tab === ClientTab.Info && <ClientInfo client={client} />}
          {tab === ClientTab.Contacts && <ClientContacts clientId={client.id} />}
          {tab === ClientTab.Projects && <ClientProjects clientId={client.id} />}
        </>
      )}
    </PageShell>
  );
}
