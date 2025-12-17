import { useState } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import { PendingActions, Visibility } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { AddJobDialog, JobTable } from "../../Job";
import type { Job } from "../../../types";
import { chipStyles, noJobsDisplayStyles } from "./styles";

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
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">{jobs.length || 0} jobs</Typography>
            <Visibility fontSize="small" />
          </Stack>
        }
        variant="outlined"
        size="small"
        sx={chipStyles}
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
        {jobs.length > 0 ? (
          <Stack sx={noJobsDisplayStyles}>
            <PendingActions sx={{ fontSize: 40, color: "#ccc" }} />
            <Typography fontSize={16} color="#ccc">
              No Jobs Found
            </Typography>
          </Stack>
        ) : (
          <JobTable jobs={jobs} />
        )}
      </UniversalDialog>
    </>
  );
}
