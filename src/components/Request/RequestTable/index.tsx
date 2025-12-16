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
import { ellipsisTextBoxStyles, tableCellStyles } from "./styles";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { RequestApprovalDialog } from "../RequestApprovalDialog";
import { DescriptionDialog } from "../../DescriptionDialog";
dayjs.extend(utc);

interface Props {
  requests: Request[];
  onRefetch?: () => void;
}

export function RequestsTable({ requests, onRefetch }: Props) {
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
                    <Title fontSize="small" sx={{ color: "#777" }} />
                    <Typography variant="body2" noWrap color="#aaa">
                      {r.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  <Box sx={ellipsisTextBoxStyles}>
                    <CalendarToday fontSize="small" sx={{ color: "#888" }} />
                    <Typography variant="body2" noWrap sx={{ color: "#aaa" }}>
                      {formatDate(r.createdAt)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  {r.description ? (
                    <Box
                      sx={{
                        ...ellipsisTextBoxStyles,
                        cursor: "pointer",
                        "&:hover .desc": {
                          color: "white",
                          textDecoration: "underline",
                        },
                      }}
                      onClick={() => setOpenDescription(r.description)}
                    >
                      <Visibility fontSize="small" sx={{ color: "#777" }} />
                      <Typography
                        className="desc"
                        variant="body2"
                        noWrap
                        sx={{ color: "#aaa" }}
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
                      color: "white",
                      borderColor: "#444",
                      "& .MuiChip-icon": { color: "#888" },
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
                  <RequestApprovalDialog request={r} onRefetch={onRefetch} />
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
