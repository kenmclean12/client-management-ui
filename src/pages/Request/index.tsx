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
  Card,
  Tooltip,
} from "@mui/material";
import {
  Assignment,
  PriorityHigh,
  CalendarToday,
  Title,
  Visibility,
  Check,
} from "@mui/icons-material";
import { Request, RequestStatus, RequestUpdateDto, UserResponseDto } from "../../types";
import {
  useRequestsGetAll,
  useRequestsUpdate,
  useUsersGetAllAdmins,
} from "../../hooks";
import {
  PageShell,
  RequestDescriptionDialog,
  UniversalDialog,
  UserSelect,
} from "../../components";
import {
  priorityConfig,
  statusConfig,
  statusLabels,
  tableHeaders,
} from "./config";
import {
  cardStyles,
  ellipsisTextBoxStyles,
  paperStyles,
  tableCellStyles,
  textFieldStyles,
} from "./styles";
import {
  dialogButtonStyles,
  tableContainerStyles,
  tableStyles,
} from "../styles";
import { formatDate } from "../../utils";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface EditingRequest {
  id: number | null;
  data: RequestUpdateDto;
}

export default function RequestsPage() {
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [openDescription, setOpenDescription] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(
    null
  );
  const [editingRequest, setEditingRequest] = useState<EditingRequest | null>(
    null
  );
  const { data: requests, refetch } = useRequestsGetAll();
  const { data: users } = useUsersGetAllAdmins();
  const { mutateAsync: updateRequest } = useRequestsUpdate(
    editingRequest?.id || 0
  );

  const handleEditClick = (request: Request) => {
    setEditingRequest({
      id: request.id,
      data: {
        priority: request.priority,
        status: RequestStatus.Approved,
        assignedUserId: null,
        dueDate: null,
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
            <TableContainer sx={{ ...tableContainerStyles, height: "670px" }}>
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
                        <Tooltip title={r.title}>
                          <Box sx={ellipsisTextBoxStyles}>
                            <Title
                              fontSize="small"
                              sx={{ color: "#777", flexShrink: 0 }}
                            />
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ color: "white" }}
                            >
                              {r.title}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={tableCellStyles}>
                        <Tooltip title={r.title}>
                          <Box sx={ellipsisTextBoxStyles}>
                            <CalendarToday
                              fontSize="small"
                              sx={{ mr: 0.5, color: "#888" }}
                            />
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ color: "white" }}
                            >
                              {formatDate(r.createdAt)}
                            </Typography>
                          </Box>
                        </Tooltip>
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
                          <Check />
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
        title="Approve Request"
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
          <UserSelect
            users={users ?? []}
            value={selectedUser}
            onChange={(user: UserResponseDto | null) => {
              if (!editingRequest) return;
              setSelectedUser(user);
              setEditingRequest({
                ...editingRequest,
                data: {
                  ...editingRequest.data,
                  assignedUserId: user?.id as number,
                },
              });
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due date"
              value={
                editingRequest?.data.dueDate
                  ? dayjs.utc(editingRequest.data.dueDate)
                  : null
              }
              onChange={(value: Dayjs | null) => {
                if (!editingRequest) return;
                setEditingRequest({
                  ...editingRequest,
                  data: {
                    ...editingRequest.data,
                    dueDate: value ? value.utc().toISOString() : null,
                  },
                });
              }}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: textFieldStyles,
                },
              }}
            />
          </LocalizationProvider>
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
