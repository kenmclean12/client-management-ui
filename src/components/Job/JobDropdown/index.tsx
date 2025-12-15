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
} from "@mui/material";
import { Edit, Delete, Save, Cancel, Add } from "@mui/icons-material";
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

interface Props {
  clientId: number;
  projectId: number;
  jobs?: Job[];
  refreshParent: () => void;
}

export function ProjectJobsDropdown({
  clientId,
  projectId,
  jobs = [],
  refreshParent,
}: Props) {
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
      refreshParent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
      refreshParent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddJob = async (dto: JobCreateDto) => {
    try {
      await createMutation.mutateAsync(dto);
      setShowAddDialog(false);
      refreshParent();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Job Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(jobs.length
            ? jobs
            : allJobs?.filter((j) => j.projectId === projectId) || []
          ).map((job) => (
            <TableRow key={job.id} hover>
              <TableCell>
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
              <TableCell>
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
                    SelectProps={{ native: true }}
                  >
                    {Object.entries(jobStatusKeyMap).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </TextField>
                ) : (
                  <Chip label={jobStatusKeyMap[job.status]} size="small" />
                )}
              </TableCell>
              <TableCell>
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
                    SelectProps={{ native: true }}
                  >
                    {Object.entries(jobPriorityKeyMap).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </TextField>
                ) : (
                  <Chip
                    label={jobPriorityKeyMap[job.priority]}
                    size="small"
                    variant="outlined"
                  />
                )}
              </TableCell>
              <TableCell>
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
              <TableCell>
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
              <TableCell align="right">
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
                    <IconButton onClick={handleDelete} color="error">
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

      <Button
        startIcon={<Add />}
        onClick={() => setShowAddDialog(true)}
        sx={{ mt: 1 }}
      >
        Add Job
      </Button>
    </Box>
  );
}
