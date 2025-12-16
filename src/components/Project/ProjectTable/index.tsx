import { Fragment, useState } from "react";
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
  Box,
  Stack,
  Chip,
  Collapse,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Work,
  Check,
} from "@mui/icons-material";
import { Project, ProjectUpdateDto } from "../../../types";
import {
  tableContainerStyles,
  tableStyles,
  textFieldStyles,
} from "../../../pages/styles";
import { useNavigate } from "react-router-dom";
import { JobTable } from "../../Job";

interface EditingProject {
  id: number | null;
  data: ProjectUpdateDto;
}

interface Props {
  projects: Project[];
  onCreate?: (dto: ProjectUpdateDto) => Promise<void>;
  onUpdate?: (id: number, dto: ProjectUpdateDto) => Promise<void>;
}

export function ProjectTable({ projects, onCreate, onUpdate }: Props) {
  const navigate = useNavigate();
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(
    null
  );
  const [editingProject, setEditingProject] = useState<EditingProject | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleExpand = (id: number) =>
    setExpandedProjectId((current) => (current === id ? null : id));

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
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!editingProject) return;
    setLoading(true);
    if (editingProject.id === null && onCreate) {
      await onCreate(editingProject.data);
    } else if (editingProject.id !== null && onUpdate) {
      await onUpdate(editingProject.id, editingProject.data);
    }
    setEditingProject(null);
    setShowDialog(false);
    setLoading(false);
  };

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString() : "—";

  const sortedProjects = [...projects].sort(
    (a, b) =>
      new Date(b.startDate || "").getTime() -
      new Date(a.startDate || "").getTime()
  );

  const now = new Date();
  const projectCounts = {
    total: sortedProjects.length,
    active: sortedProjects.filter(
      (p) => !p.endDate || new Date(p.endDate) > now
    ).length,
    completed: sortedProjects.filter(
      (p) => p.endDate && new Date(p.endDate) <= now
    ).length,
    jobs: sortedProjects.reduce((acc, p) => acc + (p.jobs?.length || 0), 0),
  };

  return (
    <Box sx={{ p: 0 }}>
      <Stack direction="row" spacing={2} flex={1} sx={{ mb: 2 }}>
        <Card
          sx={{ flex: 1, backgroundColor: "black", border: "1px solid #444" }}
        >
          <CardContent>
            <Typography sx={{ color: "#aaa" }} variant="body2">
              Total Projects
            </Typography>
            <Typography variant="h5" sx={{ color: "white" }}>
              {projectCounts.total}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{ flex: 1, backgroundColor: "black", border: "1px solid #444" }}
        >
          <CardContent>
            <Typography sx={{ color: "#aaa" }} variant="body2">
              Total Jobs
            </Typography>
            <Typography variant="h5" sx={{ color: "white" }}>
              {projectCounts.jobs}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Paper
        sx={{
          p: 3,
          backgroundColor: "black",
          border: "1px solid #444",
          color: "white",
        }}
      >
        {sortedProjects.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: "#aaa" }}>
            <Work sx={{ fontSize: 56, color: "#555" }} />
            <Typography>No projects found</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ ...tableContainerStyles, height: 600 }}>
            <Table stickyHeader sx={tableStyles}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Client</TableCell>
                  <TableCell align="center">Timeline</TableCell>
                  <TableCell align="center">Jobs</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProjects.map((p) => (
                  <Fragment key={p.id}>
                    <TableRow
                      hover
                      sx={{ "&:hover": { backgroundColor: "#111" } }}
                    >
                      <TableCell align="center" sx={{ maxWidth: 220 }}>
                        <Tooltip title={p.name} arrow>
                          <Typography
                            noWrap
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {p.name}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="center" sx={{ maxWidth: 300 }}>
                        <Tooltip title={p.description || ""} arrow>
                          <Typography
                            noWrap
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {p.description || "—"}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="center" sx={{ maxWidth: 180 }}>
                        {p.client ? (
                          <Tooltip title={p.client.name} arrow>
                            <Typography
                              noWrap
                              sx={{
                                cursor: "pointer",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                "&:hover": {
                                  color: "white",
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() =>
                                navigate(`/clients/${p.client?.id}`)
                              }
                            >
                              {p.client.name}
                            </Typography>
                          </Tooltip>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell align="center" sx={{ maxWidth: 200 }}>
                        <Tooltip
                          title={`${formatDate(p.startDate)} → ${formatDate(
                            p.dueDate
                          )}`}
                          arrow
                        >
                          <Typography noWrap variant="body2">
                            {formatDate(p.startDate)} → {formatDate(p.dueDate)}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          clickable
                          onClick={() => toggleExpand(p.id)}
                          label={
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <Typography variant="body2">
                                {p.jobs?.length || 0} jobs
                              </Typography>
                              {expandedProjectId === p.id ? (
                                <KeyboardArrowUp fontSize="small" />
                              ) : (
                                <KeyboardArrowDown fontSize="small" />
                              )}
                            </Stack>
                          }
                          variant="outlined"
                          size="small"
                          sx={{
                            color: "#aaa",
                            borderColor: "#555",
                            "&:hover": {
                              color: "white",
                              borderColor: "white",
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleEditClick(p)}
                          sx={{ color: "#aaa" }}
                        >
                          <Check />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0 }}>
                        <Collapse in={expandedProjectId === p.id}>
                          <Box sx={{ m: 2, ml: 6 }}>
                            <JobTable
                              clientId={p.clientId}
                              projectId={p.id}
                              jobs={p.jobs || []}
                              refreshParent={() => {}}
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { backgroundColor: "black", color: "white" } }}
      >
        <DialogTitle>
          {editingProject?.id === null ? "Create Project" : "Edit Project"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Project Name"
              value={editingProject?.data.name || ""}
              onChange={(e) =>
                setEditingProject({
                  ...editingProject!,
                  data: { ...editingProject!.data, name: e.target.value },
                })
              }
              sx={textFieldStyles}
            />
            <TextField
              label="Description"
              value={editingProject?.data.description || ""}
              onChange={(e) =>
                setEditingProject({
                  ...editingProject!,
                  data: {
                    ...editingProject!.data,
                    description: e.target.value,
                  },
                })
              }
              multiline
              rows={4}
              sx={textFieldStyles}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} sx={{ color: "#aaa" }}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={{ color: "white", borderColor: "#666" }}
            disabled={loading}
          >
            {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
