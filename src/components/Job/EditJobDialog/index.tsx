import { useState, useMemo } from "react";
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
  UserRole,
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
import { emptyJobForm, jobToForm } from "./config";
import { useAuth } from "../../../context";
import { menuPaperStyles } from "./styles";

interface Props {
  job: Job;
}

export function EditJobDialog({ job }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const { data: users = [] } = useUsersGetAll();
  const [formData, setFormData] = useState<Partial<JobUpdateDto>>(emptyJobForm);
  const { mutateAsync: updateJob } = useJobsUpdate(job.id, job.clientId);
  const isAdmin = user?.role === UserRole.Admin;
  const isAssignedUser = user?.id === job.assignedUserId;

  const isDirty = useMemo(() => {
    const original = jobToForm(job);

    return (
      formData.name !== original.name ||
      formData.description !== original.description ||
      formData.status !== original.status ||
      formData.priority !== original.priority ||
      formData.assignedUserId !== original.assignedUserId ||
      formData.dueDate !== original.dueDate
    );
  }, [formData, job]);

  const handleSave = async () => {
    if (!formData.name || !formData.dueDate) return;
    await updateJob({
      id: job.id,
      dto: {
        ...formData,
        dueDate: String(toUTCDateString(formData.dueDate)),
      },
    });

    onClose();
  };

  const handleOpen = () => {
    setFormData(jobToForm(job));
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setFormData(jobToForm(job));
  };

  return (
    <>
      <IconButton onClick={handleOpen} disabled={!isAdmin && !isAssignedUser}>
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
            disabled={!isDirty || !formData.name || !formData.dueDate}
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
            menuPaperStyles={menuPaperStyles}
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
