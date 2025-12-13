import { Box, Button, Stack, Typography } from "@mui/material";
import { Add, Group } from "@mui/icons-material";
import { PageTopBar, PagePlaceholder } from "../../components";

export default function UserPage() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", backgroundColor: "#222" }}>
      <PageTopBar
        title={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography>Users</Typography>
            <Group />
          </Stack>
        }
        actions={
          <Button variant="contained">
            <Add sx={{ color: "white" }} />
          </Button>
        }
      />
      <PagePlaceholder type="user" />
    </Box>
  );
}
