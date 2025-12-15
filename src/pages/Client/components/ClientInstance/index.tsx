import { useState } from "react";
import { Tabs, Tab, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { useClientsGetById } from "../../../../hooks";
import { ClientContacts, ClientInfo, ClientProjects } from "./components";
import { PageShell } from "../../../../components";
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
    <PageShell title="Clients" actions={<ClientAddDialog />}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mt: 1, mb: 2, paddingInline: 1 }}
      >
        <Tab label="Info" />
        <Tab label="Contacts" />
        <Tab label="Projects" />
      </Tabs>
      <Stack sx={{ maxHeight: "80vh", overflowY: "auto" }}>
      {client && (
        <>
          {tab === ClientTab.Info && <ClientInfo client={client} />}
          {tab === ClientTab.Contacts && <ClientContacts client={client} />}
          {tab === ClientTab.Projects && <ClientProjects client={client} />}
        </>
      )}
      </Stack>
    </PageShell>
  );
}
