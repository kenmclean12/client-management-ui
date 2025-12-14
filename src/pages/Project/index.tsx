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
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete,
  Add,
  Work,
  CalendarToday,
} from "@mui/icons-material";
import {
  Project,
  ProjectUpdateDto,
} from "../../types";
import {
  useProjectsGetAll,
  useProjectsCreate,
  useProjectsUpdate,
  useProjectsDelete,
} from "../../hooks";
import { format } from "date-fns";
import { toUTCDateString } from "../../components/utils";
import { ProjectJobsDropdown } from "../Client/components/ClientInstance/components/Projects/components";

interface EditingProject {
  id: number | null;
  data: ProjectUpdateDto;
}

export function ProjectPage() {
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [editingProject, setEditingProject] =
    useState<EditingProject | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    data: projects,
    refetch,
    isLoading,
    error,
  } = useProjectsGetAll();

  const createMutation = useProjectsCreate();
  const updateMutation = useProjectsUpdate(editingProject?.id || 0);
  const deleteMutation = useProjectsDelete(projectToDelete?.id || 0);

  const toggleExpand = (id: number) => {
    setExpandedProjects((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
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
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
    setEditingProject({
      id: null,
      data: {
        name: "",
        description: "",
        clientId: null,
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: null,
      },
    });
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
      } else {
        await updateMutation.mutateAsync({
          id: editingProject.id,
          dto,
        });
      }

      setEditingProject(null);
      setShowAddDialog(false);
      refetch();
      setNotification({ message: "Saved successfully", type: "success" });
    } catch (err: any) {
      setNotification({
        message: err.message || "Save failed",
        type: "error",
      });
    }
  };

  const formatDate = (d?: string | null) =>
    d ? format(new Date(d), "MMM dd, yyyy") : "—";

  return (
    <>
      <Paper sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            All Projects
          </Typography>
          <Button startIcon={<Add />} variant="contained" onClick={handleAddClick}>
            Add Project
          </Button>
        </Box>

        {projects?.length === 0 ? (
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
                {projects?.map((p) => (
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

                      <TableCell>
                        {editingProject?.id === p.id ? (
                          <TextField
                            value={editingProject.data.name || ""}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                data: {
                                  ...editingProject.data,
                                  name: e.target.value,
                                },
                              })
                            }
                            size="small"
                          />
                        ) : (
                          p.name
                        )}
                      </TableCell>

                      <TableCell>{p.client?.name || "—"}</TableCell>

                      <TableCell>
                        <CalendarToday fontSize="small" />{" "}
                        {formatDate(p.startDate)} → {formatDate(p.endDate)}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`${p.jobs?.length || 0} jobs`}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack direction="row" spacing={1}>
                          <IconButton onClick={() => handleEditClick(p)}>
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setProjectToDelete(p);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Delete />
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
      <Snackbar
        open={!!notification}
        autoHideDuration={5000}
        onClose={() => setNotification(null)}
      >
        <Alert severity={notification?.type}>{notification?.message}</Alert>
      </Snackbar>
    </>
  );
}
