import { Stack, Avatar, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function UserPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        width: "100%",
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
            width: 120,
            height: 120,
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
    </Box>
  );
}