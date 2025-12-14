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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Cancel,
  Add,
  Assignment,
  PriorityHigh,
  CheckCircle,
  Pending,
  Block,
  NewReleases,
  CalendarToday,
  Description,
  Title,
  PendingActions,
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
  useRequestsDelete,
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
  [RequestPriority.Low]: {
    label: "Low",
    color: "success",
  },
  [RequestPriority.Normal]: {
    label: "Normal",
    color: "info",
  },
  [RequestPriority.High]: {
    label: "High",
    color: "error",
  },
};

interface EditingRequest {
  id: number | null; // null for new request
  data: RequestUpdateDto;
}

export default function RequestsPage() {
  // State
  const [editingRequest, setEditingRequest] = useState<EditingRequest | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<Request | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Queries and Mutations
  const { data: requests, refetch } = useRequestsGetAll();
  const createMutation = useRequestsCreate();
  const updateMutation = useRequestsUpdate(editingRequest?.id || 0);
  const deleteMutation = useRequestsDelete(requestToDelete?.id || 0);

  // Handlers
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
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
    setEditingRequest({
      id: null,
      data: {
        title: "",
        description: "",
        priority: RequestPriority.Low,
        status: RequestStatus.New,
        projectId: null,
        jobId: null,
      },
    });
  };

  const handleCancelEdit = () => {
    setEditingRequest(null);
    setShowAddDialog(false);
  };

  const handleSaveEdit = async () => {
    if (!editingRequest) return;

    try {
      if (editingRequest.id === null) {
        // Create new request
        const createDto: RequestCreateDto = {
          title: editingRequest.data.title || "",
          description: editingRequest.data.description || "",
          clientId: 1, // You'll need to get this from context or props
          priority: editingRequest.data.priority || RequestPriority.Normal,
          projectId: editingRequest.data.projectId,
          jobId: editingRequest.data.jobId,
        };
        await createMutation.mutateAsync(createDto);
        setNotification({
          message: "Request created successfully",
          type: "success",
        });
      } else {
        // Update existing request
        await updateMutation.mutateAsync({
          id: editingRequest.id,
          dto: editingRequest.data,
        });
        setNotification({
          message: "Request updated successfully",
          type: "success",
        });
      }
      setEditingRequest(null);
      setShowAddDialog(false);
      refetch();
    } catch (error: any) {
      setNotification({
        message: error.message || "Operation failed",
        type: "error",
      });
    }
  };

  const handleDeleteClick = (request: Request) => {
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!requestToDelete) return;

    try {
      await deleteMutation.mutateAsync();
      setNotification({
        message: "Request deleted successfully",
        type: "success",
      });
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
      refetch();
    } catch (error: any) {
      setNotification({
        message: error.message || "Failed to delete request",
        type: "error",
      });
    }
  };

  const handleChange = (field: keyof RequestUpdateDto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editingRequest) {
      setEditingRequest({
        ...editingRequest,
        data: {
          ...editingRequest.data,
          [field]: e.target.value,
        },
      });
    }
  };

  const handleSelectChange = (field: keyof RequestUpdateDto) => (
    e: any
  ) => {
    if (editingRequest) {
      setEditingRequest({
        ...editingRequest,
        data: {
          ...editingRequest.data,
          [field]: e.target.value,
        },
      });
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const isEditing = (requestId: number) => editingRequest?.id === requestId;

  // Sort requests by creation date (newest first)
  const sortedRequests = [...(requests || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Count requests by status
  const statusCounts = {
    new: sortedRequests.filter(r => r.status === RequestStatus.New).length,
    reviewed: sortedRequests.filter(r => r.status === RequestStatus.Reviewed).length,
    approved: sortedRequests.filter(r => r.status === RequestStatus.Approved).length,
    rejected: sortedRequests.filter(r => r.status === RequestStatus.Rejected).length,
  };

  return (
    <PageShell title="Pending Requests" icon={<PendingActions />}>
      <Box sx={{ p: 3, pt: 11 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Requests
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            disabled={createMutation.isPending}
          >
            Add Request
          </Button>
        </Box>

        {/* Status Summary */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                New
              </Typography>
              <Typography variant="h5">{statusCounts.new}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Reviewed
              </Typography>
              <Typography variant="h5">{statusCounts.reviewed}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Approved
              </Typography>
              <Typography variant="h5">{statusCounts.approved}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Rejected
              </Typography>
              <Typography variant="h5">{statusCounts.rejected}</Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Requests Table */}
        <Paper
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          {sortedRequests.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <Assignment sx={{ fontSize: 60, mb: 2, color: "action.disabled" }} />
              <Typography variant="h6">No requests yet</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedRequests.map((request) => (
                    <TableRow key={request.id} hover>
                      {/* Title */}
                      <TableCell>
                        {isEditing(request.id) ? (
                          <TextField
                            value={editingRequest?.data.title || ""}
                            onChange={handleChange("title")}
                            size="small"
                            fullWidth
                            required
                          />
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Title color="action" fontSize="small" />
                            <Typography>{request.title}</Typography>
                          </Box>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {isEditing(request.id) ? (
                          <FormControl fullWidth size="small">
                            <Select
                              value={editingRequest?.data.status || RequestStatus.New}
                              onChange={handleSelectChange("status")}
                            >
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <MenuItem key={key} value={Number(key)}>
                                  {config.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Chip
                            label={statusConfig[request.status].label}
                            color={statusConfig[request.status].color as any}
                            icon={statusConfig[request.status].icon}
                            size="small"
                          />
                        )}
                      </TableCell>

                      {/* Priority */}
                      <TableCell>
                        {isEditing(request.id) ? (
                          <FormControl fullWidth size="small">
                            <Select
                              value={editingRequest?.data.priority || RequestPriority.Normal}
                              onChange={handleSelectChange("priority")}
                            >
                              {Object.entries(priorityConfig).map(([key, config]) => (
                                <MenuItem key={key} value={Number(key)}>
                                  {config.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Chip
                            label={priorityConfig[request.priority].label}
                            color={priorityConfig[request.priority].color as any}
                            icon={<PriorityHigh fontSize="small" />}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>

                      {/* Created Date */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2">
                            {formatDate(request.createdAt)}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Description */}
                      <TableCell>
                        {isEditing(request.id) ? (
                          <TextField
                            value={editingRequest?.data.description || ""}
                            onChange={handleChange("description")}
                            size="small"
                            fullWidth
                            multiline
                            rows={1}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            <Description fontSize="small" color="action" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                            {request.description?.substring(0, 50) || "No description"}
                            {request.description && request.description.length > 50 ? "..." : ""}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        {isEditing(request.id) ? (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
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
                                !editingRequest?.data.title ||
                                !editingRequest?.data.description
                              }
                            >
                              <Save />
                            </IconButton>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(request)}
                              disabled={!!editingRequest}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(request)}
                              disabled={deleteMutation.isPending}
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
        <DialogTitle>Create New Request</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Request Title"
              value={editingRequest?.data.title || ""}
              onChange={handleChange("title")}
              fullWidth
              required
              placeholder="Enter a clear title for the request"
              error={!editingRequest?.data.title}
              helperText={!editingRequest?.data.title ? "Required" : ""}
            />
            
            <TextField
              label="Description"
              value={editingRequest?.data.description || ""}
              onChange={handleChange("description")}
              fullWidth
              required
              multiline
              rows={4}
              placeholder="Describe the request in detail..."
              error={!editingRequest?.data.description}
              helperText={!editingRequest?.data.description ? "Required" : ""}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editingRequest?.data.priority || RequestPriority.Normal}
                  onChange={handleSelectChange("priority")}
                  label="Priority"
                >
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <MenuItem key={key} value={Number(key)}>
                      {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingRequest?.data.status || RequestStatus.New}
                  onChange={handleSelectChange("status")}
                  label="Status"
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <MenuItem key={key} value={Number(key)}>
                      {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Project ID (Optional)"
                type="number"
                value={editingRequest?.data.projectId || ""}
                onChange={handleChange("projectId")}
                fullWidth
                placeholder="Enter project ID"
              />
              <TextField
                label="Job ID (Optional)"
                type="number"
                value={editingRequest?.data.jobId || ""}
                onChange={handleChange("jobId")}
                fullWidth
                placeholder="Enter job ID"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={
              createMutation.isPending ||
              !editingRequest?.data.title ||
              !editingRequest?.data.description
            }
          >
            {createMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "Create Request"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Request</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{requestToDelete?.title}</strong>?
          </Typography>
          <Card variant="outlined" sx={{ mt: 2, p: 2, maxHeight: 150, overflow: "auto" }}>
            <Typography variant="body2" color="text.secondary">
              {requestToDelete?.description?.substring(0, 200) || "No description"}
              {requestToDelete?.description && requestToDelete.description.length > 200 ? "..." : ""}
            </Typography>
          </Card>
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
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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
    </PageShell>
  );
}