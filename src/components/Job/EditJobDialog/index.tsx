import { useState } from "react";
import {
  IconButton,
  Stack,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import {
  Job,
  JobUpdateDto,
  jobPriorityKeyMap,
  jobStatusKeyMap,
} from "../../../types";
import { toUTCDateString } from "../../../utils";
import { UniversalDialog } from "../../UniversalDialog";
import {
  dialogButtonStyles,
  selectStyles,
  textFieldStyles,
} from "../../../pages/styles";
import { useJobsUpdate, useUsersGetAll } from "../../../hooks";
import { darkMenuProps } from "../styles";
import { UserSelect } from "../../User";

interface Props {
  job: Job;
}

export function EditJobDialog({ job }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { data: users = [] } = useUsersGetAll();

  const [formData, setFormData] = useState<Partial<JobUpdateDto>>({
    name: job.name,
    description: job.description,
    status: job.status,
    priority: job.priority,
    assignedUserId: job.assignedUserId ?? undefined,
    dueDate: job.dueDate.slice(0, 10),
  });

  const { mutateAsync: updateJob } = useJobsUpdate(job.id, job.clientId);

  const handleSave = async () => {
    if (!formData.name || !formData.dueDate) return;

    await updateJob({
      id: job.id,
      dto: {
        ...formData,
        dueDate: String(toUTCDateString(formData.dueDate)),
      },
    });

    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
    setFormData({
      name: job.name,
      description: job.description,
      status: job.status,
      priority: job.priority,
      assignedUserId: job.assignedUserId ?? undefined,
      dueDate: job.dueDate.slice(0, 10),
    });
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Edit sx={{ color: "white" }} />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={onClose}
        title="Edit Job"
        footer={
          <Button
            variant="contained"
            onClick={handleSave}
            sx={dialogButtonStyles}
            disabled={!formData.name || !formData.dueDate}
          >
            Save
          </Button>
        }
      >
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Job Name"
            fullWidth
            size="small"
            sx={textFieldStyles}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            size="small"
            sx={textFieldStyles}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <FormControl fullWidth size="small" sx={textFieldStyles}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              size="small"
              sx={selectStyles}
              MenuProps={darkMenuProps}
              onChange={(e) =>
                setFormData({ ...formData, status: Number(e.target.value) })
              }
            >
              {Object.entries(jobStatusKeyMap).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={textFieldStyles}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              size="small"
              sx={selectStyles}
              MenuProps={darkMenuProps}
              onChange={(e) =>
                setFormData({ ...formData, priority: Number(e.target.value) })
              }
            >
              {Object.entries(jobPriorityKeyMap).map(([k, v]) => (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <UserSelect
            users={users}
            value={users.find((u) => u.id === formData.assignedUserId) ?? null}
            onChange={(user) =>
              setFormData({
                ...formData,
                assignedUserId: user?.id ?? undefined,
              })
            }
            menuPaperStyles={{
              backgroundColor: "#121212",
              color: "white",
              border: "1px solid #2a2a2a",
            }}
          />
          <TextField
            label="Due Date"
            type="date"
            size="small"
            sx={textFieldStyles}
            fullWidth
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </UniversalDialog>
    </>
  );
}
