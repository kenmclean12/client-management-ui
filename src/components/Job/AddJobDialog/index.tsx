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
import { useJobsCreate } from "../../../hooks";
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
  const { mutateAsync: createJob } = useJobsCreate();

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

  return (
    <>
      <Tooltip title="Add Job">
        <IconButton onClick={() => setOpen(true)}>
          <Add sx={{ color: "white" }} />
        </IconButton>
      </Tooltip>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
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
