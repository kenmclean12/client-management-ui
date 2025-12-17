import { useState } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { JobTable } from "../../Job";
import type { Job } from "../../../types";

interface Props {
  jobs: Job[];
  clientId: number;
  projectId: number;
}

export function JobsDialog({ jobs, clientId, projectId }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Chip
        clickable
        onClick={() => setOpen(true)}
        label={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2">{jobs.length || 0} jobs</Typography>
            <Visibility fontSize="small" />
          </Stack>
        }
        variant="outlined"
        size="small"
        sx={{
          color: "#aaa",
          borderColor: "#555",
          "&:hover": { color: "white", borderColor: "white" },
        }}
      />
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Project Jobs"
        maxWidth="lg"
      >
        {jobs.length === 0 ? (
          <Typography color="#aaa" sx={{ textAlign: "center", py: 4 }}>
            No jobs found for this project.
          </Typography>
        ) : (
          <JobTable clientId={clientId} projectId={projectId} jobs={jobs} />
        )}
      </UniversalDialog>
    </>
  );
}
