import { useState } from "react";
import { IconButton, Button, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { Project, ProjectStatus } from "../../../types";
import { dialogButtonStyles } from "../../../pages/styles";
import { useProjectsUpdate } from "../../../hooks";

interface Props {
  project: Project;
}

export function ProjectCompletionDialog({ project }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync: updateProject } = useProjectsUpdate(project.id);

  const handleConfirm = async () => {
    updateProject({
      id: project.id,
      dto: { projectStatus: ProjectStatus.Done },
    });
  };

  return (
    <>
      <IconButton sx={{ color: "green" }} onClick={() => setOpen(true)}>
        <CheckCircle />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Mark Project as Completed"
        footer={
          <Button
            variant="outlined"
            onClick={handleConfirm}
            sx={dialogButtonStyles}
          >
            Submit
          </Button>
        }
      >
        <Typography>
          Are you sure you want to mark <b>{project.name}</b> as completed? The
          client will be notified by email immediately.
        </Typography>
      </UniversalDialog>
    </>
  );
}
