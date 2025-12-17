import { useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import { Job } from "../../../types";
import { useJobsGetByClient } from "../../../hooks";
import { format } from "date-fns";
import { tableStyles } from "../../../pages/styles";
import { jobPriorityConfig, jobStatusConfig } from "./config";
import { EditJobDialog } from "../EditJobDialog";
import { DeleteJobDialog } from "../DeleteJobDialog";
import { UserRow } from "../../User";

interface Props {
  clientId: number;
  projectId: number;
  jobs?: Job[];
}

export function JobTable({ clientId, projectId, jobs = [] }: Props) {
  const navigate = useNavigate();
  const { data: allJobs } = useJobsGetByClient(clientId);
  const visibleJobs =
    jobs.length > 0
      ? jobs
      : allJobs?.filter((j) => j.projectId === projectId) || [];

  return (
    <Box>
      <Table stickyHeader size="small" sx={tableStyles}>
        <TableHead>
          <TableRow>
            <TableCell align="left">Assigned</TableCell>
            <TableCell align="center">Job Name</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Due Date</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Priority</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleJobs.map((job) => (
            <TableRow key={job.id} hover>
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
              <TableCell align="center">{job.name}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
