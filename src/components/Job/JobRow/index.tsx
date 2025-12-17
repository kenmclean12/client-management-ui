import { useNavigate } from "react-router-dom";
import {
  Box,
  TableCell,
  TableRow,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import { Job } from "../../../types";
import { format } from "date-fns";
import { EditJobDialog } from "../EditJobDialog";
import { DeleteJobDialog } from "../DeleteJobDialog";
import { UserRow } from "../../User";
import { jobPriorityConfig, jobStatusConfig } from "./config";

interface Props {
  clientId: number;
  job: Job;
  userPage?: boolean;
}

export function JobRow({ clientId, job, userPage }: Props) {
  const navigate = useNavigate();
  return (
    <TableRow key={job.id} hover>
      {!userPage && (
        <TableCell align="left">
          {job.assignedUser ? (
            <UserRow
              user={job.assignedUser}
              onClick={() => navigate(`/users/${job.assignedUserId}`)}
            />
          ) : (
            <Box height="32px" />
          )}
        </TableCell>
      )}
      <TableCell align="center" sx={{ color: "white" }}>
        {job.name}
      </TableCell>
      <TableCell align="center">{job.description}</TableCell>
      <TableCell align="center">
        {format(new Date(job.dueDate), "yyyy-MM-dd")}
      </TableCell>
      <TableCell align="center">
        <Chip
          size="small"
          label={jobStatusConfig[job.status].label}
          icon={jobStatusConfig[job.status].icon}
          color={jobStatusConfig[job.status].color}
        />
      </TableCell>
      <TableCell align="center">
        <Chip
          size="small"
          variant="outlined"
          label={jobPriorityConfig[job.priority].label}
          icon={jobPriorityConfig[job.priority].icon}
          sx={{
            color: "white",
            borderColor: "#444",
            "& .MuiChip-icon": { color: "#888" },
          }}
        />
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <EditJobDialog job={job} />
          <IconButton color="error" onClick={() => {}}>
            <DeleteJobDialog
              jobId={job.id}
              jobName={job.name}
              clientId={clientId}
            />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
