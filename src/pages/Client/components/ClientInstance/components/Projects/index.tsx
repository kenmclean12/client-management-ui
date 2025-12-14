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
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete,
  Save,
  Cancel,
  Add,
  Work,
  CalendarToday,
} from "@mui/icons-material";
import {
  Project,
  ProjectUpdateDto,
} from "../../../../../../types";
import {
  useProjectsGetByClient,
  useProjectsCreate,
  useProjectsUpdate,
  useProjectsDelete,
} from "../../../../../../hooks";
import { format } from "date-fns";
import { toUTCDateString } from "../../../../../../components/utils";
import { ProjectJobsDropdown } from "../../../../../../components";

interface Props {
  clientId: number;
}

interface EditingProject {
  id: number | null; // null for new project
  data: ProjectUpdateDto;
}

export function ClientProjects({ clientId }: Props) {
  // State
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [editingProject, setEditingProject] = useState<EditingProject | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Queries and Mutations
  const {
    data: projects,
    refetch,
    isLoading,
    error,
  } = useProjectsGetByClient(clientId);
  const createMutation = useProjectsCreate();
  const updateMutation = useProjectsUpdate(editingProject?.id || 0);
  const deleteMutation = useProjectsDelete(projectToDelete?.id || 0);

  // Handlers
  const toggleProjectExpand = (projectId: number) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
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
        clientId: clientId,
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: null,
      },
    });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    if (showAddDialog) {
      setShowAddDialog(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;

    try {
      const payload = {
        ...editingProject.data,
        startDate: toUTCDateString(editingProject.data.startDate),
        endDate: toUTCDateString(editingProject.data.endDate),
      };

      if (editingProject.id === null) {
        // Create new project
        await createMutation.mutateAsync({
          name: payload.name || "",
          description: payload.description,
          clientId: clientId,
          startDate: payload.startDate!,
          endDate: payload.endDate,
        });
        setNotification({
          message: "Project created successfully",
          type: "success",
        });
      } else {
        // Update existing project
        await updateMutation.mutateAsync({
          id: editingProject.id,
          dto: payload,
        });
        setNotification({
          message: "Project updated successfully",
          type: "success",
        });
      }

      setEditingProject(null);
      setShowAddDialog(false);
      refetch();
    } catch (error: any) {
      setNotification({
        message: error.message || "Operation failed",
        type: "error",
      });
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await deleteMutation.mutateAsync();
      setNotification({
        message: "Project deleted successfully",
        type: "success",
      });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      refetch();
    } catch (error: any) {
      setNotification({
        message: error.message || "Failed to delete project",
        type: "error",
      });
    }
  };

  const handleChange =
    (field: keyof ProjectUpdateDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (editingProject) {
        setEditingProject({
          ...editingProject,
          data: {
            ...editingProject.data,
            [field]: e.target.value || null,
          },
        });
      }
    };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const isEditing = (projectId: number) => editingProject?.id === projectId;

  // Render loading state
  if (isLoading) {
    return (
      <Paper sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  // Render error state
  if (error) {
    return (
      <Paper sx={{ p: 4 }}>
        <Alert severity="error">
          Failed to load projects: {error.message}
        </Alert>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Projects
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            disabled={createMutation.isPending}
          >
            Add Project
          </Button>
        </Box>

        {projects?.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Work sx={{ fontSize: 60, mb: 2, color: "action.disabled" }} />
            <Typography variant="h6">No projects yet</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Add the first project to this client
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50} />
                  <TableCell>Project</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Timeline</TableCell>
                  <TableCell>Jobs</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects?.map((project) => (
                  <>
                    {/* Project Row */}
                    <TableRow key={project.id} hover>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleProjectExpand(project.id)}
                        >
                          {expandedProjects.includes(project.id) ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>

                      {/* Project Name */}
                      <TableCell>
                        {isEditing(project.id) ? (
                          <TextField
                            value={editingProject?.data.name || ""}
                            onChange={handleChange("name")}
                            size="small"
                            fullWidth
                            required
                            error={!editingProject?.data.name}
                          />
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Work color="action" fontSize="small" />
                            <Typography fontWeight={500}>
                              {project.name}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>

                      {/* Project Description */}
                      <TableCell>
                        {isEditing(project.id) ? (
                          <TextField
                            value={editingProject?.data.description || ""}
                            onChange={handleChange("description")}
                            size="small"
                            fullWidth
                            multiline
                            rows={1}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {project.description || "No description"}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Timeline */}
                      <TableCell>
                        {isEditing(project.id) ? (
                          <Stack spacing={1}>
                            <TextField
                              label="Start Date"
                              type="date"
                              value={editingProject?.data.startDate || ""}
                              onChange={handleChange("startDate")}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              label="End Date"
                              type="date"
                              value={editingProject?.data.endDate || ""}
                              onChange={handleChange("endDate")}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                        ) : (
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <CalendarToday fontSize="small" color="action" />
                              <Typography variant="body2">
                                {formatDate(project.startDate)}
                              </Typography>
                            </Box>
                            {project.endDate && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                → {formatDate(project.endDate)}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>

                      {/* Job Count */}
                      <TableCell>
                        <Chip
                          label={`${project.jobs?.length || 0} jobs`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        {isEditing(project.id) ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              size="small"
                              onClick={handleCancelEdit}
                              disabled={updateMutation.isPending}
                            >
                              <Cancel />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={handleSaveEdit}
                              disabled={
                                updateMutation.isPending ||
                                !editingProject?.data.name
                              }
                            >
                              <Save />
                            </IconButton>
                          </Stack>
                        ) : (
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(project)}
                              disabled={!!editingProject}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(project)}
                              disabled={deleteMutation.isPending}
                            >
                              <Delete />
                            </IconButton>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0, borderTop: 0 }}>
                        <Collapse
                          in={expandedProjects.includes(project.id)}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ m: 2, ml: 6 }}>
                            <ProjectJobsDropdown
                              clientId={clientId}
                              projectId={project.id}
                              jobs={project.jobs || []}
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

      {/* Add Project Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Project Name"
              value={editingProject?.data.name || ""}
              onChange={handleChange("name")}
              fullWidth
              required
              error={!editingProject?.data.name}
              helperText={!editingProject?.data.name ? "Required" : ""}
            />
            <TextField
              label="Description"
              value={editingProject?.data.description || ""}
              onChange={handleChange("description")}
              fullWidth
              multiline
              rows={3}
              placeholder="Describe the project..."
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                value={editingProject?.data.startDate || ""}
                onChange={handleChange("startDate")}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date (Optional)"
                type="date"
                value={editingProject?.data.endDate || ""}
                onChange={handleChange("endDate")}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelEdit}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={
              createMutation.isPending ||
              !editingProject?.data.name ||
              !editingProject?.data.startDate
            }
          >
            {createMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{projectToDelete?.name}</strong>?
          </Typography>
          {projectToDelete?.jobs && projectToDelete.jobs.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This project contains {projectToDelete.jobs.length} job(s) that
              will also be deleted.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Deleting...
              </>
            ) : (
              "Delete Project"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.type}
          sx={{ width: "100%" }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </>
  );
}