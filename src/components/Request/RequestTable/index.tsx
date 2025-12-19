/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  PriorityHigh,
  CalendarToday,
  Title,
  Visibility,
} from "@mui/icons-material";
import { Request } from "../../../types";
import { priorityConfig, statusConfig, tableHeaders } from "./config";
import { formatDate } from "../../../utils";
import { tableContainerStyles, tableStyles } from "../../../pages/styles";
import {
  clientNameTextStyles,
  descriptionBoxStyles,
  ellipsisTextBoxStyles,
  tableCellStyles,
} from "./styles";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { RequestApprovalDialog } from "../RequestApprovalDialog";
import { DescriptionDialog } from "../../DescriptionDialog";
import { RequestUpdateDialog } from "../RequestUpdateDialog";
import { useNavigate } from "react-router-dom";
import { priorityColorConfig } from "../../config";
dayjs.extend(utc);

interface Props {
  requests: Request[];
}

export function RequestsTable({ requests }: Props) {
  const navigate = useNavigate();
  const [openDescription, setOpenDescription] = useState<string>("");

  return (
    <>
      <TableContainer sx={{ ...tableContainerStyles, height: "670px" }}>
        <Table stickyHeader sx={tableStyles}>
          <TableHead>
            <TableRow>
              {tableHeaders.map((h) => (
                <TableCell key={h} align="center" sx={tableCellStyles}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((r) => (
              <TableRow
                key={r.id}
                hover
                sx={{ "&:hover": { bgcolor: "#111" } }}
              >
                <TableCell align="center" sx={tableCellStyles}>
                  <Box sx={ellipsisTextBoxStyles}>
                    <Tooltip title={r.client.name} arrow>
                      <Typography
                        onClick={() => navigate(`/clients/${r.client?.id}`)}
                        sx={clientNameTextStyles}
                        noWrap
                      >
                        {r.client.name}
                      </Typography>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  <Box sx={ellipsisTextBoxStyles}>
                    <Title fontSize="small" sx={{ color: "#777" }} />
                    <Tooltip title={r.title} arrow>
                      <Typography variant="body2" color="#aaa" noWrap>
                        {r.title}
                      </Typography>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  <Box sx={ellipsisTextBoxStyles}>
                    <CalendarToday fontSize="small" sx={{ color: "#888" }} />
                    <Typography variant="body2" color="#aaa" noWrap>
                      {formatDate(r.createdAt)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  {r.description ? (
                    <Box
                      onClick={() => setOpenDescription(r.description)}
                      sx={descriptionBoxStyles}
                    >
                      <Visibility fontSize="small" sx={{ color: "#777" }} />
                      <Typography
                        className="desc"
                        variant="body2"
                        color="#aaa"
                        noWrap
                      >
                        {r.description}
                      </Typography>
                    </Box>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={priorityConfig[r.priority]}
                    icon={<PriorityHigh fontSize="small" />}
                    sx={{
                      backgroundColor:
                        priorityColorConfig[r.priority].backgroundColor,
                      color: priorityColorConfig[r.priority].color,
                      borderColor: priorityColorConfig[r.priority].borderColor,
                      "& .MuiChip-icon": {
                        color: priorityColorConfig[r.priority].color,
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  <Chip
                    size="small"
                    label={statusConfig[r.status].label}
                    icon={statusConfig[r.status].icon}
                    color={statusConfig[r.status].color as any}
                  />
                </TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  <Stack direction="row" justifyContent="center" spacing={0.5}>
                    <RequestUpdateDialog request={r} />
                    <RequestApprovalDialog request={r} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {openDescription && (
        <DescriptionDialog
          open
          title="Task Request Description"
          description={openDescription}
          onClose={() => setOpenDescription("")}
        />
      )}
    </>
  );
}
