import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TableCell,
  TableRow,
  IconButton,
  Stack,
  Chip,
  Typography,
  Tooltip,
} from "@mui/material";
import { Job } from "../../../types";
import { format } from "date-fns";
import { EditJobDialog } from "../EditJobDialog";
import { DeleteJobDialog } from "../DeleteJobDialog";
import { UserRow } from "../../User";
import { DescriptionDialog } from "../../DescriptionDialog";
import {
  clientNameTextStyles,
  descriptionTextStyles,
  ellipsisCellSx,
} from "./styles";
import { jobPriorityConfig, jobStatusConfig } from "../JobTable/config";
import { priorityColorConfig } from "../../config";

interface Props {
  clientId: number;
  job: Job;
  userPage?: boolean;
}

export function JobRow({ clientId, job, userPage }: Props) {
  const navigate = useNavigate();
  const [openDesc, setOpenDesc] = useState<boolean>(false);

  return (
    <>
      <TableRow hover>
        {!userPage && (
          <TableCell align="left" sx={ellipsisCellSx}>
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
        <TableCell align="center" sx={{ ...ellipsisCellSx, color: "white" }}>
          <Tooltip title={job.name} arrow>
            <span style={{ cursor: "pointer" }}>{job.name}</span>
          </Tooltip>
        </TableCell>
        <TableCell align="center" sx={ellipsisCellSx}>
          <Typography
            component="span"
            onClick={() => setOpenDesc(true)}
            sx={descriptionTextStyles}
          >
            {job.description || "—"}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ maxWidth: 180 }}>
          {job.client ? (
            <Tooltip title={job.client.name} arrow>
              <Typography
                onClick={() => navigate(`/clients/${job.client?.id}`)}
                sx={clientNameTextStyles}
                noWrap
              >
                {job.client.name}
              </Typography>
            </Tooltip>
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell align="center" sx={ellipsisCellSx}>
          {job.dueDate ? format(new Date(job.dueDate), "yyyy-MM-dd") : "n/a"}
        </TableCell>
        <TableCell align="center" sx={ellipsisCellSx}>
          <Chip
            size="small"
            variant="outlined"
            label={jobPriorityConfig[job.priority].label}
            icon={jobPriorityConfig[job.priority].icon}
            sx={{
              backgroundColor:
                priorityColorConfig[job.priority].backgroundColor,
              color: priorityColorConfig[job.priority].color,
              borderColor: priorityColorConfig[job.priority].borderColor,
              "& .MuiChip-icon": {
                color: priorityColorConfig[job.priority].color,
              },
            }}
          />
        </TableCell>
        <TableCell align="center" sx={ellipsisCellSx}>
          <Chip
            size="small"
            label={jobStatusConfig[job.status].label}
            icon={jobStatusConfig[job.status].icon}
            sx={{
              border: `1px solid ${jobStatusConfig[job.status].color}`,
              color: jobStatusConfig[job.status].color,
              "& .MuiChip-icon": {
                color: jobStatusConfig[job.status].color,
              },
            }}
          />
        </TableCell>
        <TableCell align="center">
          <Stack direction="row" justifyContent="center" spacing={0.5}>
            <EditJobDialog job={job} />
            <IconButton color="error">
              <DeleteJobDialog
                jobId={job.id}
                jobName={job.name}
                clientId={clientId}
              />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
      <DescriptionDialog
        open={openDesc}
        title="Job Description"
        description={job.description}
        onClose={() => setOpenDesc(false)}
      />
    </>
  );
}
