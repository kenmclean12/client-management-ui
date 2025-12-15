import { PagePlaceholder, PageShell, UserInviteForm } from "../../components";

export function UserPage() {
  return (
    <PageShell title="Users" actions={<UserInviteForm />}>
      <PagePlaceholder type="user" />
    </PageShell>
  );
}
