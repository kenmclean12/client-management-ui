import { PagePlaceholder, PageShell } from "../../components";
import ClientAddDialog from "../../components/Client/ClientAddForm";

export default function ClientPage() {
  return (
    <PageShell title="Clients" actions={<ClientAddDialog />}>
      <PagePlaceholder type="client" />
    </PageShell>
  );
}
