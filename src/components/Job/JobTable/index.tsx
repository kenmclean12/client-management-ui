import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import {
  Job,
  JobCreateDto,
  JobUpdateDto,
  jobPriorityKeyMap,
  jobStatusKeyMap,
} from "../../../types";
import {
  useJobsGetByClient,
  useJobsCreate,
  useJobsUpdate,
  useJobsDelete,
} from "../../../hooks";
import { format } from "date-fns";
import { toUTCDateString } from "../../../utils";
import { tableStyles } from "../../../pages/styles";
import { jobPriorityConfig, jobStatusConfig } from "./config";

interface Props {
  clientId: number;
  projectId: number;
  jobs?: Job[];
}

export function JobTable({ clientId, projectId, jobs = [] }: Props) {
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editingJobData, setEditingJobData] = useState<JobUpdateDto>({});
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: allJobs } = useJobsGetByClient(clientId);
  const createMutation = useJobsCreate();
  const updateMutation = useJobsUpdate(editingJobId || 0);
  const deleteMutation = useJobsDelete(editingJobId || 0);

  const handleEditClick = (job: Job) => {
    setEditingJobId(job.id);
    setEditingJobData({ ...job });
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setEditingJobData({});
  };

  const handleSaveEdit = async () => {
    if (!editingJobId) return;
    try {
      const dto: JobUpdateDto = {
        ...editingJobData,
        ...(editingJobData.dueDate
          ? { dueDate: String(toUTCDateString(editingJobData.dueDate)) }
          : {}),
      };

      await updateMutation.mutateAsync({
        id: editingJobId,
        dto,
      });

      setEditingJobId(null);
      setEditingJobData({});
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddJob = async (dto: JobCreateDto) => {
    await createMutation.mutateAsync(dto);
    setShowAddDialog(false);
  };

  return (
    <Box>
      <Table stickyHeader size="small" sx={tableStyles}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Job Name</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Priority</TableCell>
            <TableCell align="center">Due Date</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(jobs.length
            ? jobs
            : allJobs?.filter((j) => j.projectId === projectId) || []
          ).map((job) => (
            <TableRow key={job.id} hover>
              <TableCell align="center">
                {editingJobId === job.id ? (
                  <TextField
                    value={editingJobData.name || ""}
                    onChange={(e) =>
                      setEditingJobData({
                        ...editingJobData,
                        name: e.target.value,
                      })
                    }
                    size="small"
                    fullWidth
                  />
                ) : (
                  job.name
                )}
              </TableCell>
              <TableCell align="center">
                {editingJobId === job.id ? (
                  <TextField
                    select
                    value={editingJobData.status || job.status}
                    onChange={(e) =>
                      setEditingJobData({
                        ...editingJobData,
                        status: Number(e.target.value),
                      })
                    }
                  >
                    {Object.entries(jobStatusConfig).map(([k, v]) => (
                      <MenuItem key={k} value={k}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {v.icon}
                          <span>{v.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Chip
                    size="small"
                    label={jobStatusConfig[job.status].label}
                    icon={jobStatusConfig[job.status].icon}
                    color={jobStatusConfig[job.status].color}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                {editingJobId === job.id ? (
                  <TextField
                    select
                    value={editingJobData.priority || job.priority}
                    onChange={(e) =>
                      setEditingJobData({
                        ...editingJobData,
                        priority: Number(e.target.value),
                      })
                    }
                  >
                    {Object.entries(jobPriorityConfig).map(([k, v]) => (
                      <MenuItem key={k} value={k}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {v.icon}
                          <span>{v.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={jobPriorityConfig[job.priority].label}
                    icon={jobPriorityConfig[job.priority].icon}
                    sx={{
                      color: "white",
                      borderColor: "#444",
                      "& .MuiChip-icon": { color: "#888" },
                    }}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                {editingJobId === job.id ? (
                  <TextField
                    type="date"
                    value={editingJobData.dueDate || ""}
                    onChange={(e) =>
                      setEditingJobData({
                        ...editingJobData,
                        dueDate: e.target.value,
                      })
                    }
                    size="small"
                  />
                ) : (
                  format(new Date(job.dueDate), "yyyy-MM-dd")
                )}
              </TableCell>
              <TableCell align="center">
                {editingJobId === job.id ? (
                  <TextField
                    value={editingJobData.description || ""}
                    onChange={(e) =>
                      setEditingJobData({
                        ...editingJobData,
                        description: e.target.value,
                      })
                    }
                    size="small"
                    fullWidth
                  />
                ) : (
                  job.description
                )}
              </TableCell>
              <TableCell align="center">
                {editingJobId === job.id ? (
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={handleCancelEdit}>
                      <Cancel />
                    </IconButton>
                    <IconButton onClick={handleSaveEdit}>
                      <Save />
                    </IconButton>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleEditClick(job)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={async () => await deleteMutation.mutateAsync()}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogTitle>Add Job</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Job Name"
              fullWidth
              value={editingJobData.name || ""}
              onChange={(e) =>
                setEditingJobData({ ...editingJobData, name: e.target.value })
              }
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={editingJobData.description || ""}
              onChange={(e) =>
                setEditingJobData({
                  ...editingJobData,
                  description: e.target.value,
                })
              }
            />
            <TextField
              label="Status"
              select
              value={editingJobData.status || 1}
              onChange={(e) =>
                setEditingJobData({
                  ...editingJobData,
                  status: Number(e.target.value),
                })
              }
              SelectProps={{ native: true }}
            >
              {Object.entries(jobStatusKeyMap).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </TextField>
            <TextField
              label="Priority"
              select
              value={editingJobData.priority || 1}
              onChange={(e) =>
                setEditingJobData({
                  ...editingJobData,
                  priority: Number(e.target.value),
                })
              }
              SelectProps={{ native: true }}
            >
              {Object.entries(jobPriorityKeyMap).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Due Date"
              fullWidth
              value={editingJobData.dueDate || ""}
              onChange={(e) =>
                setEditingJobData({
                  ...editingJobData,
                  dueDate: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!editingJobData.name || !editingJobData.dueDate) return;
              handleAddJob({
                name: editingJobData.name,
                description: editingJobData.description || "",
                clientId: Number(clientId),
                projectId,
                status: editingJobData.status || 1,
                priority: editingJobData.priority || 1,
                dueDate: String(toUTCDateString(editingJobData.dueDate)),
                estimatedFinish: editingJobData.estimatedFinish || null,
              });
            }}
            disabled={!editingJobData.name || !editingJobData.dueDate}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
