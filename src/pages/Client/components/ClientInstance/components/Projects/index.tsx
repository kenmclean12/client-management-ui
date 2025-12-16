import { Paper, Typography, Box, Divider } from "@mui/material";
import { Client } from "../../../../../../types";
import { useProjectsGetByClient } from "../../../../../../hooks";
import { ProjectTable } from "../../../../../../components";

interface Props {
  client: Client;
}

export function ClientProjects({ client }: Props) {
  const { data: projects } = useProjectsGetByClient(client.id);

  return (
    <Paper
      sx={{
        height: "80.25vh",
        p: 3,
        m: 1,
        mt: 2,
        backgroundColor: "black",
        border: "1px solid #444",
        borderRadius: 2,
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontSize={18} fontWeight={600} sx={{ color: "white" }}>
          Projects
        </Typography>
      </Box>
      <Divider sx={{ my: 2, backgroundColor: "#444" }} />
      <ProjectTable projects={projects ?? []} />
    </Paper>
  );
}
