import { useRef, useState } from "react";
import { Tabs, Tab, Stack, Fab, Fade } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
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

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setShowScrollTop(scrollRef.current.scrollTop > 200);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <PageShell title="Clients" actions={<ClientAddDialog />}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mt: 1, mb: 2, px: 1 }}
      >
        <Tab label="Info" />
        <Tab label="Contacts" />
        <Tab label="Projects" />
      </Tabs>

      <Stack
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          maxHeight: "80vh",
          width: "80vw",
          overflowY: "auto",
          position: "relative",
          pr: 1,
        }}
      >
        {client && (
          <>
            {tab === ClientTab.Info && <ClientInfo client={client} />}
            {tab === ClientTab.Contacts && <ClientContacts client={client} />}
            {tab === ClientTab.Projects && <ClientProjects client={client} />}
          </>
        )}

        <Fade in={showScrollTop}>
          <Fab
            size="small"
            color="primary"
            onClick={scrollToTop}
            sx={{
              position: "sticky",
              bottom: 16,
              alignSelf: "flex-end",
              mt: 2,
            }}
          >
            <KeyboardArrowUp />
          </Fab>
        </Fade>
      </Stack>
    </PageShell>
  );
}
