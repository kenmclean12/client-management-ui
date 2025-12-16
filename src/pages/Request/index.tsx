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
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit,
  Save,
  Assignment,
  PriorityHigh,
  CheckCircle,
  Pending,
  Block,
  NewReleases,
  CalendarToday,
  Description,
  Title,
} from "@mui/icons-material";
import {
  Request,
  RequestCreateDto,
  RequestPriority,
  RequestStatus,
  RequestUpdateDto,
} from "../../types";
import {
  useRequestsGetAll,
  useRequestsCreate,
  useRequestsUpdate,
} from "../../hooks";
import { format } from "date-fns";
import { PageShell } from "../../components";

const statusConfig = {
  [RequestStatus.New]: {
    label: "New",
    color: "info",
    icon: <NewReleases fontSize="small" />,
  },
  [RequestStatus.Reviewed]: {
    label: "Reviewed",
    color: "warning",
    icon: <Pending fontSize="small" />,
  },
  [RequestStatus.Approved]: {
    label: "Approved",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },
  [RequestStatus.Rejected]: {
    label: "Rejected",
    color: "error",
    icon: <Block fontSize="small" />,
  },
};

const priorityConfig = {
  [RequestPriority.Low]: "Low",
  [RequestPriority.Normal]: "Normal",
  [RequestPriority.High]: "High",
};

interface EditingRequest {
  id: number | null;
  data: RequestUpdateDto;
}

export default function RequestsPage() {
  const [editingRequest, setEditingRequest] = useState<EditingRequest | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { data: requests, refetch } = useRequestsGetAll();
  const createMutation = useRequestsCreate();
  const updateMutation = useRequestsUpdate(editingRequest?.id || 0);

  const handleEditClick = (request: Request) => {
    setEditingRequest({
      id: request.id,
      data: {
        title: request.title,
        description: request.description,
        priority: request.priority,
        status: request.status,
        projectId: request.projectId,
        jobId: request.jobId,
      },
    });
    setShowAddDialog(true);
  };

  const handleCancelEdit = () => {
    setEditingRequest(null);
    setShowAddDialog(false);
  };

  const handleSaveEdit = async () => {
    if (!editingRequest) return;

    try {
      if (editingRequest.id === null) {
        const dto: RequestCreateDto = {
          title: editingRequest.data.title || "",
          description: editingRequest.data.description || "",
          clientId: 1,
          priority: editingRequest.data.priority ?? RequestPriority.Normal,
          projectId: editingRequest.data.projectId,
          jobId: editingRequest.data.jobId,
        };
        await createMutation.mutateAsync(dto);
        setNotification({ message: "Request created", type: "success" });
      } else {
        await updateMutation.mutateAsync({
          id: editingRequest.id,
          dto: editingRequest.data,
        });
        setNotification({ message: "Request updated", type: "success" });
      }

      setEditingRequest(null);
      setShowAddDialog(false);
      refetch();
    } catch (err: any) {
      setNotification({
        message: err.message || "Operation failed",
        type: "error",
      });
    }
  };

  const handleChange =
    (field: keyof RequestUpdateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editingRequest) return;
      setEditingRequest({
        ...editingRequest,
        data: { ...editingRequest.data, [field]: e.target.value },
      });
    };

  const formatDate = (d?: string | null) =>
    d ? format(new Date(d), "MMM dd, yyyy HH:mm") : "—";

  const sortedRequests = [...(requests || [])].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return (
    <PageShell title="Requests">
      <Box sx={{ p: 3 }}>
        {/* STATS */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          {[
            {
              label: "New",
              count: sortedRequests.filter(r => r.status === RequestStatus.New).length,
            },
            {
              label: "Pending",
              count: sortedRequests.filter(r => r.status === RequestStatus.Reviewed).length,
            },
          ].map(s => (
            <Card
              key={s.label}
              sx={{
                flex: 1,
                bgcolor: "#0b0b0b",
                border: "1px solid #1f1f1f",
              }}
            >
              <CardContent>
                <Typography fontSize={13} sx={{ color: "#aaa" }}>
                  {s.label}
                </Typography>
                <Typography variant="h5" sx={{ color: "white", mt: 0.5 }}>
                  {s.count}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* TABLE */}
        <Paper sx={{ p: 3, bgcolor: "#0b0b0b", border: "1px solid #1f1f1f" }}>
          {sortedRequests.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Assignment sx={{ fontSize: 56, color: "#555" }} />
              <Typography sx={{ color: "#aaa", mt: 1 }}>
                No requests found
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Title", "Status", "Priority", "Created", "Description", "Actions"].map(h => (
                      <TableCell key={h} sx={{ color: "#aaa", fontSize: 13 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {sortedRequests.map(r => (
                    <TableRow
                      key={r.id}
                      hover
                      sx={{ "&:hover": { bgcolor: "#111" } }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Title fontSize="small" sx={{ color: "#777" }} />
                          {r.title}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={statusConfig[r.status].label}
                          icon={statusConfig[r.status].icon}
                          color={statusConfig[r.status].color as any}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={priorityConfig[r.priority]}
                          icon={<PriorityHigh fontSize="small" />}
                          sx={{
                            color: "white",
                            borderColor: "#444",
                            "& .MuiChip-icon": { color: "#888" },
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ color: "#ccc" }}>
                        <CalendarToday fontSize="small" sx={{ mr: 0.5, color: "#888" }} />
                        {formatDate(r.createdAt)}
                      </TableCell>

                      <TableCell sx={{ color: "#aaa", maxWidth: 240 }} noWrap>
                        <Description fontSize="small" sx={{ mr: 0.5, color: "#888" }} />
                        {r.description || "—"}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton sx={{ color: "white" }} onClick={() => handleEditClick(r)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* DIALOG */}
      <Dialog open={showAddDialog} onClose={handleCancelEdit} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "#0b0b0b", color: "white" }}>
          {editingRequest?.id === null ? "Create Request" : "Edit Request"}
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "#0b0b0b" }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField label="Title" value={editingRequest?.data.title || ""} onChange={handleChange("title")} fullWidth />
            <TextField label="Description" value={editingRequest?.data.description || ""} onChange={handleChange("description")} fullWidth multiline rows={4} />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ bgcolor: "#0b0b0b" }}>
          <Button sx={{ color: "white" }} onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveEdit} startIcon={<Save />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!notification} autoHideDuration={5000} onClose={() => setNotification(null)}>
        <Alert severity={notification?.type}>{notification?.message}</Alert>
      </Snackbar>
    </PageShell>
  );
}
