import { Paper, Box } from "@mui/material";
import { useProjectsGetAll } from "../../hooks";
import { PageShell, ProjectTable } from "../../components";
import { paperStyles } from "./styles";

export function ProjectPage() {
  const { data: projects } = useProjectsGetAll();
  return (
    <PageShell title="Projects">
      <Box sx={{ p: 1 }}>
        <Paper sx={paperStyles}>
          <ProjectTable projects={projects ?? []} />
        </Paper>
      </Box>
    </PageShell>
  );
}
