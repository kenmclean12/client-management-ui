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
  Divider,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  CalendarToday,
  Work,
} from "@mui/icons-material";
import { Project, ProjectUpdateDto } from "../../../types";
import { ProjectJobsDropdown } from "../../../components";
import { textFieldStyles } from "../../../pages/styles";

interface EditingProject {
  id: number | null;
  data: ProjectUpdateDto;
}

interface Props {
  projects: Project[];
  onCreate?: (dto: ProjectUpdateDto) => Promise<void>;
  onUpdate?: (id: number, dto: ProjectUpdateDto) => Promise<void>;
}

export function ProjectTable({
  projects,
  onCreate,
  onUpdate,
}: Props) {
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [editingProject, setEditingProject] = useState<EditingProject | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleExpand = (id: number) =>
    setExpandedProjects((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

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
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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
        <Divider sx={{ mb: 2, backgroundColor: "#444" }} />

        {sortedProjects.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: "#aaa" }}>
            <Work sx={{ fontSize: 56, color: "#555" }} />
            <Typography>No projects found</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table
              sx={{
                "& th": { color: "#ccc", borderColor: "#333" },
                "& td": { color: "white", borderColor: "#333" },
              }}
            >
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
                {sortedProjects.map((p) => (
                  <Box key={p.id}>
                    <TableRow
                      hover
                      sx={{ "&:hover": { backgroundColor: "#111" } }}
                    >
                      <TableCell>
                        <IconButton
                          onClick={() => toggleExpand(p.id)}
                          sx={{ color: "#aaa" }}
                        >
                          {expandedProjects.includes(p.id) ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell sx={{ color: "#aaa" }}>
                        {p.client?.name || "—"}
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <CalendarToday
                            fontSize="small"
                            sx={{ color: "#777" }}
                          />
                          <Typography variant="body2">
                            {formatDate(p.startDate)} → {formatDate(p.endDate)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${p.jobs?.length || 0} jobs`}
                          size="small"
                          variant="outlined"
                          sx={{ color: "#aaa", borderColor: "#555" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {onUpdate && (
                          <IconButton
                            onClick={() => handleEditClick(p)}
                            sx={{ color: "#aaa" }}
                          >
                            <Edit />
                          </IconButton>
                        )}
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
                              refreshParent={() => {}}
                            />
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Box>
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
