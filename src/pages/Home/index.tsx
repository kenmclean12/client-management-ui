import { Button, Stack } from "@mui/material";
import { useAuth } from "../../context/authContext";

export default function HomePage() {
  const { logout } = useAuth();

  return (
    <Stack>
      Home
      <Button onClick={logout}>Logout</Button>
    </Stack>
  );
}
