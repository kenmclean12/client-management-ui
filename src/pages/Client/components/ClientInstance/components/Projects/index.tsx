import { Paper, Typography, Box, Divider } from "@mui/material";
import { Client } from "../../../../../../types";
import { useProjectsGetByClient } from "../../../../../../hooks";
import { ProjectTable } from "../../../../../../components";
import { boxStyles, paperStyles } from "./styles";

interface Props {
  client: Client;
}

export function ClientProjects({ client }: Props) {
  const { data: projects } = useProjectsGetByClient(client.id);

  return (
    <Paper sx={paperStyles}>
      <Box sx={boxStyles}>
        <Typography fontSize={18} fontWeight={600} color="white">
          Projects
        </Typography>
      </Box>
      <Divider sx={{ my: 2, backgroundColor: "#444" }} />
      <ProjectTable projects={projects ?? []} clientSpecific />
    </Paper>
  );
}
