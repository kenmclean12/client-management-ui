import { Stack, Avatar, Typography, Box, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { PageTopBar } from "../../components";
import { Add, Group } from "@mui/icons-material";

export default function UserPage() {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#222",
      }}
    >
      <Stack
        spacing={3}
        alignItems="center"
        sx={{
          p: 4,
          textAlign: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: "grey.400",
            fontSize: "3rem",
          }}
        >
          <PersonIcon sx={{ fontSize: 60 }} />
        </Avatar>

        <Typography variant="h6" color="white" fontWeight="medium">
          Select a user from the side panel
        </Typography>
      </Stack>
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
    </Box>
  );
}
