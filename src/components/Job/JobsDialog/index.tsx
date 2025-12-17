import { useState } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { AddJobDialog, JobTable } from "../../Job";
import type { Job } from "../../../types";

interface Props {
  jobs: Job[];
  clientId: number;
  projectId: number;
}

export function JobsDialog({ jobs, clientId, projectId }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [openAddJob, setOpenAddJob] = useState<boolean>(false);

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
        topRightAction={
          <AddJobDialog clientId={clientId} projectId={projectId} />
        }
      >
        {jobs.length === 0 ? (
          <Typography color="#aaa" sx={{ textAlign: "center", py: 4 }}>
            No jobs found for this project.
          </Typography>
        ) : (
          <JobTable jobs={jobs} />
        )}
      </UniversalDialog>
      <UniversalDialog
        open={openAddJob}
        onClose={() => setOpenAddJob(false)}
        title="Add Job"
        maxWidth="sm"
      >
        <Typography color="#aaa">Add Job Form goes here</Typography>
      </UniversalDialog>
    </>
  );
}
