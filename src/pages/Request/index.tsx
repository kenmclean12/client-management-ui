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
  Card,
} from "@mui/material";
import {
  Edit,
  Assignment,
  PriorityHigh,
  CalendarToday,
  Title,
  Visibility,
} from "@mui/icons-material";
import { Request, RequestUpdateDto } from "../../types";
import { useRequestsGetAll, useRequestsUpdate } from "../../hooks";
import {
  PageShell,
  RequestDescriptionDialog,
  UniversalDialog,
} from "../../components";
import {
  priorityConfig,
  statusConfig,
  statusLabels,
  tableHeaders,
} from "./config";
import {
  cardStyles,
  paperStyles,
  tableCellStyles,
} from "./styles";
import { dialogButtonStyles, tableStyles, textFieldStyles } from "../styles";
import { formatDate } from "../../utils";

interface EditingRequest {
  id: number | null;
  data: RequestUpdateDto;
}

export default function RequestsPage() {
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [openDescription, setOpenDescription] = useState<string>("");
  const [editingRequest, setEditingRequest] = useState<EditingRequest | null>(
    null
  );
  const { data: requests, refetch } = useRequestsGetAll();
  const { mutateAsync: updateRequest } = useRequestsUpdate(
    editingRequest?.id || 0
  );

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
      await updateRequest({
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

  const sortedRequests = [...(requests || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <PageShell title="Requests">
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} mb={2}>
          {statusLabels(sortedRequests).map((s) => (
            <Card key={s.label} sx={cardStyles}>
              <Typography fontSize={13} color="#aaa">
                {s.label}
              </Typography>
              <Typography variant="h5" color="white" mt={0.5}>
                {s.count}
              </Typography>
            </Card>
          ))}
        </Stack>
        <Paper sx={paperStyles}>
          {sortedRequests.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Assignment sx={{ fontSize: 56, color: "#555" }} />
              <Typography sx={{ color: "#aaa", mt: 1 }}>
                No requests found
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table stickyHeader sx={tableStyles}>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((h) => (
                      <TableCell key={h} sx={tableCellStyles}>
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
                      <TableCell sx={tableCellStyles}>
                        <Title fontSize="small" sx={{ color: "#777" }} />
                        {r.title}
                      </TableCell>
                      <TableCell sx={tableCellStyles}>
                        <CalendarToday
                          fontSize="small"
                          sx={{ mr: 0.5, color: "#888" }}
                        />
                        {formatDate(r.createdAt)}
                      </TableCell>
                      <TableCell sx={tableCellStyles}>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          height="100%"
                          width="100%"
                        >
                          <IconButton
                            onClick={() => setOpenDescription(r.description)}
                          >
                            <Visibility
                              sx={{ color: "white", cursor: "pointer" }}
                            />
                          </IconButton>
                        </Stack>
                      </TableCell>
                      <TableCell sx={tableCellStyles}>
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
                      <TableCell sx={tableCellStyles}>
                        <Chip
                          size="small"
                          label={statusConfig[r.status].label}
                          icon={statusConfig[r.status].icon}
                          color={statusConfig[r.status].color as any}
                        />
                      </TableCell>
                      <TableCell align="right" sx={tableCellStyles}>
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
      <UniversalDialog
        open={showAddDialog}
        onClose={handleCancelEdit}
        title="Edit Request"
        footer={
          <Button
            variant="outlined"
            onClick={handleSaveEdit}
            sx={dialogButtonStyles}
          >
            Save
          </Button>
        }
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="User Id"
            value={editingRequest?.data.assignedUserId || 0}
            onChange={handleChange("assignedUserId")}
            size="small"
            sx={textFieldStyles}
            fullWidth
          />
          <TextField
            label="Due date"
            value={editingRequest?.data.dueDate || ""}
            onChange={handleChange("dueDate")}
            fullWidth
            size="small"
            sx={textFieldStyles}
            multiline
            rows={4}
          />
        </Stack>
      </UniversalDialog>
      {openDescription && (
        <RequestDescriptionDialog
          open={!!openDescription}
          title="Task Request Description"
          description={openDescription}
          onClose={() => setOpenDescription("")}
        />
      )}
    </PageShell>
  );
}
