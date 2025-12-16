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
  Divider,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Save,
  Cancel,
  Work,
  CalendarToday,
} from "@mui/icons-material";
import { Client, Project, ProjectUpdateDto } from "../../../../../../types";
import {
  useProjectsGetByClient,
  useProjectsCreate,
  useProjectsUpdate,
} from "../../../../../../hooks";
import { format } from "date-fns";
import { toUTCDateString } from "../../../../../../utils";
import { ProjectJobsDropdown } from "../../../../../../components";

interface Props {
  client: Client;
}

interface EditingProject {
  id: number | null;
  data: ProjectUpdateDto;
}

const darkTextFieldSx = {
  "& .MuiInputBase-input": {
    color: "white",
    backgroundColor: "black",
  },
  "& .MuiInputLabel-root": { color: "#ccc" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "black",
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#777" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
};

export function ClientProjects({ client }: Props) {
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [editingProject, setEditingProject] = useState<EditingProject | null>(null);

  const { data: projects, refetch } = useProjectsGetByClient(client.id);
  const createMutation = useProjectsCreate();
  const updateMutation = useProjectsUpdate(editingProject?.id || 0);

  const toggleProjectExpand = (id: number) => {
    setExpandedProjects((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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

  const handleCancelEdit = () => setEditingProject(null);

  const handleSaveEdit = async () => {
    if (!editingProject) return;

    const payload = {
      ...editingProject.data,
      startDate: toUTCDateString(editingProject.data.startDate),
      endDate: toUTCDateString(editingProject.data.endDate),
    };

    if (editingProject.id === null) {
      await createMutation.mutateAsync({
        name: payload.name || "",
        description: payload.description,
        clientId: client.id,
        startDate: payload.startDate!,
        endDate: payload.endDate,
      });
    } else {
      await updateMutation.mutateAsync({ id: editingProject.id, dto: payload });
    }

    setEditingProject(null);
    refetch();
  };

  const handleChange =
    (field: keyof ProjectUpdateDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!editingProject) return;
      setEditingProject({
        ...editingProject,
        data: { ...editingProject.data, [field]: e.target.value || null },
      });
    };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const isEditing = (id: number) => editingProject?.id === id;

  return (
    <Paper
      sx={{
        p: 3,
        m: 1,
        mt: 2,
        backgroundColor: "black",
        border: "1px solid #444",
        borderRadius: 2,
        color: "white",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" fontWeight={600} sx={{ color: "white" }}>
          Projects
        </Typography>
      </Box>

      <Divider sx={{ my: 2, backgroundColor: "#444" }} />

      {projects?.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "#aaa" }}>
          <Work sx={{ fontSize: 60, mb: 2, color: "#555" }} />
          <Typography variant="h6">No projects yet</Typography>
          <Typography sx={{ mt: 1 }}>Add the first project to this client</Typography>
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
                <TableCell>Description</TableCell>
                <TableCell>Timeline</TableCell>
                <TableCell>Jobs</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects?.map((project) => (
                <>
                  <TableRow key={project.id} hover sx={{ "&:hover": { backgroundColor: "#111" } }}>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleProjectExpand(project.id)} sx={{ color: "#aaa" }}>
                        {expandedProjects.includes(project.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>

                    <TableCell>
                      {isEditing(project.id) ? (
                        <TextField fullWidth size="small" value={editingProject?.data.name || ""} onChange={handleChange("name")} sx={darkTextFieldSx} />
                      ) : (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Work fontSize="small" sx={{ color: "#777" }} />
                          <Typography fontWeight={500}>{project.name}</Typography>
                        </Stack>
                      )}
                    </TableCell>

                    <TableCell>
                      {isEditing(project.id) ? (
                        <TextField fullWidth size="small" multiline rows={1} value={editingProject?.data.description || ""} onChange={handleChange("description")} sx={darkTextFieldSx} />
                      ) : (
                        <Typography variant="body2" sx={{ color: "#aaa" }}>
                          {project.description || "No description"}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {isEditing(project.id) ? (
                        <Stack spacing={1}>
                          <TextField type="date" label="Start" value={editingProject?.data.startDate || ""} onChange={handleChange("startDate")} size="small" InputLabelProps={{ shrink: true }} sx={darkTextFieldSx} />
                          <TextField type="date" label="End" value={editingProject?.data.endDate || ""} onChange={handleChange("endDate")} size="small" InputLabelProps={{ shrink: true }} sx={darkTextFieldSx} />
                        </Stack>
                      ) : (
                        <Box>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarToday fontSize="small" sx={{ color: "#777" }} />
                            <Typography variant="body2">{formatDate(project.startDate)}</Typography>
                          </Stack>
                          {project.endDate && (
                            <Typography variant="caption" sx={{ color: "#888" }}>
                              → {formatDate(project.endDate)}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip label={`${project.jobs?.length || 0} jobs`} size="small" variant="outlined" sx={{ color: "#aaa", borderColor: "#555" }} />
                    </TableCell>

                    <TableCell align="right">
                      {isEditing(project.id) ? (
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton onClick={handleCancelEdit} sx={{ color: "#aaa" }}>
                            <Cancel />
                          </IconButton>
                          <IconButton onClick={handleSaveEdit} sx={{ color: "white" }} disabled={!editingProject?.data.name}>
                            <Save />
                          </IconButton>
                        </Stack>
                      ) : (
                        <IconButton onClick={() => handleEditClick(project)} disabled={!!editingProject} sx={{ color: "#aaa" }}>
                          <Edit />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0, borderTop: 0 }}>
                      <Collapse in={expandedProjects.includes(project.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2, ml: 6 }}>
                          <ProjectJobsDropdown clientId={client.id} projectId={project.id} jobs={project.jobs || []} refreshParent={refetch} />
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
  );
}