import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Job } from "../../../types";
import { tableStyles } from "../../../pages/styles";
import { JobRow } from "../JobRow";

interface Props {
  jobs?: Job[];
  userPage?: boolean;
}

export function JobTable({ jobs = [], userPage }: Props) {
  return (
    <Box width="100%">
      <Table
        stickyHeader
        size="small"
        sx={{
          ...tableStyles,
          maxHeight: "650px",
          width: "100%",
          tableLayout: "fixed",
          overflowY: "auto",
        }}
      >
        <TableHead>
          <TableRow>
            {!userPage && <TableCell align="left">Assigned</TableCell>}
            <TableCell align="center">Job Name</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Due Date</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Priority</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {jobs.map((job) => (
            <JobRow
              key={job.id}
              job={job}
              clientId={job.clientId}
              userPage={userPage}
            />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
