import { useState } from "react";
import { IconButton, Button, Typography, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useJobsDelete } from "../../../hooks";
import { UniversalDialog } from "../../UniversalDialog";
import { dialogButtonStyles } from "../../../pages/styles";

interface Props {
  jobId: number;
  jobName?: string;
  clientId: number;
}

export function DeleteJobDialog({ jobId, jobName, clientId }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync: deleteJob } = useJobsDelete(jobId, clientId);

  const handleDelete = async () => {
    await deleteJob();
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Delete Job">
        <IconButton onClick={() => setOpen(true)}>
          <Delete sx={{ color: "#ff5252" }} />
        </IconButton>
      </Tooltip>

      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Job"
        footer={
          <Button
            variant="outlined"
            onClick={handleDelete}
            sx={dialogButtonStyles}
          >
            Delete
          </Button>
        }
      >
        <Typography color="white">
          Are you sure you want to delete
          {jobName ? ` "${jobName}"` : " this job"}? This action cannot be
          undone.
        </Typography>
      </UniversalDialog>
    </>
  );
}
