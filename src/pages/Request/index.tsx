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
  CalendarToday,
  Description,
  Title,
} from "@mui/icons-material";
import { Request, RequestStatus, RequestUpdateDto } from "../../types";
import { useRequestsGetAll, useRequestsUpdate } from "../../hooks";
import { format } from "date-fns";
import { PageShell } from "../../components";
import { priorityConfig, statusConfig } from "./config";

interface EditingRequest {
  id: number | null;
  data: RequestUpdateDto;
}

export default function RequestsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRequest, setEditingRequest] = useState<EditingRequest | null>(
    null
  );
  const { data: requests, refetch } = useRequestsGetAll();
  const updateMutation = useRequestsUpdate(editingRequest?.id || 0);

  const handleEditClick = (request: Request) => {
    setEditingRequest({
      id: request.id,
      data: {
        priority: request.priority,
        status: request.status,
        assignedUserId: 0,
        dueDate: new Date().toString(),
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

    if (editingRequest.id !== null) {
      await updateMutation.mutateAsync({
        id: editingRequest.id,
        dto: editingRequest.data,
      });
    }

    setEditingRequest(null);
    setShowAddDialog(false);
    refetch();
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
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <PageShell title="Requests">
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          {[
            {
              label: "New",
              count: sortedRequests.filter(
                (r) => r.status === RequestStatus.New
              ).length,
            },
            {
              label: "Pending",
              count: sortedRequests.filter(
                (r) => r.status === RequestStatus.Reviewed
              ).length,
            },
          ].map((s) => (
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
                    {[
                      "Title",
                      "Status",
                      "Priority",
                      "Created",
                      "Description",
                      "Actions",
                    ].map((h) => (
                      <TableCell key={h} sx={{ color: "#aaa", fontSize: 13 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {sortedRequests.map((r) => (
                    <TableRow
                      key={r.id}
                      hover
                      sx={{ "&:hover": { bgcolor: "#111" } }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
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
                        <CalendarToday
                          fontSize="small"
                          sx={{ mr: 0.5, color: "#888" }}
                        />
                        {formatDate(r.createdAt)}
                      </TableCell>

                      <TableCell sx={{ color: "#aaa", maxWidth: 240 }}>
                        <Description
                          fontSize="small"
                          sx={{ mr: 0.5, color: "#888" }}
                        />
                        {r.description || "—"}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          sx={{ color: "white" }}
                          onClick={() => handleEditClick(r)}
                        >
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
      <Dialog
        open={showAddDialog}
        onClose={handleCancelEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#0b0b0b", color: "white" }}>
          {editingRequest?.id === null ? "Create Request" : "Edit Request"}
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "#0b0b0b" }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={editingRequest?.data.assignedUserId || 0}
              onChange={handleChange("assignedUserId")}
              fullWidth
            />
            <TextField
              label="Description"
              value={editingRequest?.data.dueDate || ""}
              onChange={handleChange("dueDate")}
              fullWidth
              multiline
              rows={4}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ bgcolor: "#0b0b0b" }}>
          <Button sx={{ color: "white" }} onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            startIcon={<Save />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageShell>
  );
}
