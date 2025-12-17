import { useState } from "react";
import {
  IconButton,
  Stack,
  TextField,
  Button,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useJobsCreate, useUsersGetAll } from "../../../hooks";
import {
  JobCreateDto,
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
import { darkMenuProps } from "../styles";
import { UserSelect } from "../../User";

interface Props {
  clientId: number;
  projectId: number;
}

export function AddJobDialog({ clientId, projectId }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<JobCreateDto>>({
    name: "",
    description: "",
    status: 1,
    priority: 1,
    dueDate: "",
  });
  const { data: users = [] } = useUsersGetAll();
  const { mutateAsync: createJob } = useJobsCreate(clientId);

  const handleAdd = async () => {
    if (!formData.name || !formData.dueDate) return;

    await createJob({
      ...formData,
      clientId,
      projectId,
      dueDate: String(toUTCDateString(formData.dueDate!)),
    } as JobCreateDto);

    setOpen(false);
    setFormData({
      name: "",
      description: "",
      status: 1,
      priority: 1,
      dueDate: "",
    });
  };

  const onClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      description: "",
      status: 1,
      priority: 1,
      assignedUserId: undefined,
      dueDate: "",
    });
  };

  return (
    <>
      <Tooltip title="Add Job">
        <IconButton onClick={() => setOpen(true)}>
          <Add sx={{ color: "white" }} />
        </IconButton>
      </Tooltip>
      <UniversalDialog
        open={open}
        onClose={onClose}
        title="Add Job"
        footer={
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={dialogButtonStyles}
            disabled={!formData.name || !formData.dueDate}
          >
            Add
          </Button>
        }
      >
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Job Name"
            fullWidth
            value={formData.name}
            size="small"
            sx={textFieldStyles}
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
