/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Collapse,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Work,
  CalendarToday,
} from "@mui/icons-material";
import { Project, ProjectUpdateDto } from "../../types";
import {
  useProjectsGetAll,
  useProjectsCreate,
  useProjectsUpdate,
} from "../../hooks";
import { format } from "date-fns";
import { toUTCDateString } from "../../components/utils";
import { PageShell, ProjectJobsDropdown } from "../../components";

interface EditingProject {
  id: number | null;
  data: ProjectUpdateDto;
}

export function ProjectPage() {
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [editingProject, setEditingProject] = useState<EditingProject | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { data: projects, refetch } = useProjectsGetAll();
  const createMutation = useProjectsCreate();
  const updateMutation = useProjectsUpdate(editingProject?.id || 0);

  const toggleExpand = (id: number) => {
    setExpandedProjects(p =>
      p.includes(id) ? p.filter(x => x !== id) : [...p, id]
    );
  };

  const handleEditClick = (project: Project) => {
    setEditingProject({
      id: project.id,
      data: {
        name: project.name,
        description: project.description,
        clientId: project.clientId,
        startDate: project.startDate,
        endDate: project.endDate,
      },
    });
    setShowAddDialog(true);
  };

  const handleSave = async () => {
    if (!editingProject) return;

    const dto = {
      ...editingProject.data,
      startDate: toUTCDateString(editingProject.data.startDate),
      endDate: toUTCDateString(editingProject.data.endDate),
    };

    try {
      if (editingProject.id === null) {
        await createMutation.mutateAsync({
          name: dto.name!,
          description: dto.description,
          clientId: dto.clientId!,
          startDate: dto.startDate!,
          endDate: dto.endDate,
        });
        setNotification({ message: "Project created", type: "success" });
      } else {
        await updateMutation.mutateAsync({
          id: editingProject.id,
          dto,
        });
        setNotification({ message: "Project updated", type: "success" });
      }
      setEditingProject(null);
      setShowAddDialog(false);
      refetch();
    } catch (err: any) {
      setNotification({
        message: err.message || "Save failed",
        type: "error",
      });
    }
  };

  const formatDate = (d?: string | null) =>
    d ? format(new Date(d), "MMM dd, yyyy") : "—";

  const sortedProjects = [...(projects || [])].sort(
    (a, b) =>
      new Date(b.startDate || "").getTime() -
      new Date(a.startDate || "").getTime()
  );

  const now = new Date();
  const projectCounts = {
    total: sortedProjects.length,
    active: sortedProjects.filter(
      p => !p.endDate || new Date(p.endDate) > now
    ).length,
    completed: sortedProjects.filter(
      p => p.endDate && new Date(p.endDate) <= now
    ).length,
    jobs: sortedProjects.reduce(
      (acc, p) => acc + (p.jobs?.length || 0),
      0
    ),
  };

  return (
    <PageShell title="Projects" icon={<Work />}>
      <Box sx={{ p: 4, pt: 12 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Projects
              </Typography>
              <Typography variant="h5">{projectCounts.total}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Jobs
              </Typography>
              <Typography variant="h5">{projectCounts.jobs}</Typography>
            </CardContent>
          </Card>
        </Stack>

        <Paper sx={{ p: 3 }}>
          {sortedProjects.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Work sx={{ fontSize: 56, color: "action.disabled" }} />
              <Typography>No projects found</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={50} />
                    <TableCell>Project</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Timeline</TableCell>
                    <TableCell>Jobs</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProjects.map(p => (
                    <>
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <IconButton onClick={() => toggleExpand(p.id)}>
                            {expandedProjects.includes(p.id) ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.client?.name || "—"}</TableCell>
                        <TableCell>
                          <CalendarToday fontSize="small" />{" "}
                          {formatDate(p.startDate)} → {formatDate(p.endDate)}
                        </TableCell>
                        <TableCell>
                          <Chip label={`${p.jobs?.length || 0} jobs`} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1}>
                            <IconButton onClick={() => handleEditClick(p)}>
                              <Edit />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 0 }}>
                          <Collapse in={expandedProjects.includes(p.id)}>
                            <Box sx={{ m: 2, ml: 6 }}>
                              <ProjectJobsDropdown
                                clientId={p.clientId}
                                projectId={p.id}
                                jobs={p.jobs || []}
                                refreshParent={refetch}
                              />
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProject?.id === null ? "Create Project" : "Edit Project"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Project Name"
              value={editingProject?.data.name || ""}
              onChange={e =>
                setEditingProject({
                  ...editingProject!,
                  data: { ...editingProject!.data, name: e.target.value },
                })
              }
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={editingProject?.data.description || ""}
              onChange={e =>
                setEditingProject({
                  ...editingProject!,
                  data: { ...editingProject!.data, description: e.target.value },
                })
              }
              multiline
              rows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {(createMutation.isPending || updateMutation.isPending) && (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            )}
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!notification}
        autoHideDuration={5000}
        onClose={() => setNotification(null)}
      >
        <Alert severity={notification?.type}>{notification?.message}</Alert>
      </Snackbar>
    </PageShell>
  );
}
