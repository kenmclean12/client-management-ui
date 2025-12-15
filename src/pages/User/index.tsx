import { IconButton } from "@mui/material";
import { Group, Send } from "@mui/icons-material";
import { PagePlaceholder, PageShell } from "../../components";

export function UserPage() {
  return (
    <PageShell
      title="Users"
      icon={<Group />}
      actions={
        <IconButton>
          <Send sx={{ color: "white" }} />
        </IconButton>
      }
    >
      <PagePlaceholder type="user" />
    </PageShell>
  );
}
