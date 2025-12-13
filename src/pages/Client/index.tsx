import { Public } from "@mui/icons-material";
import { PagePlaceholder, PageShell } from "../../components";
import ClientAddDialog from "./components/Forms/ClientAddForm";

export default function ClientPage() {
  return (
    <PageShell
      title="Clients"
      icon={<Public />}
      actions={
        <ClientAddDialog />
      }
    >
      <PagePlaceholder type="client" />
    </PageShell>
  );
}
