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
} from "@mui/material";
import { Job } from "../../../types";
import { format } from "date-fns";
import { EditJobDialog } from "../EditJobDialog";
import { DeleteJobDialog } from "../DeleteJobDialog";
import { UserRow } from "../../User";
import { jobPriorityConfig, jobStatusConfig } from "./config";
import { DescriptionDialog } from "../../DescriptionDialog";

interface Props {
  clientId: number;
  job: Job;
  userPage?: boolean;
}

const ellipsisCellSx = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "#ccc",
  maxWidth: 0,
};

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
          {job.name}
        </TableCell>
        <TableCell align="center" sx={ellipsisCellSx}>
          <Typography
            component="span"
            onClick={() => setOpenDesc(true)}
            sx={{
              cursor: "pointer",
              color: "#ccc",
              "&:hover": {
                color: "white",
                textDecoration: "underline",
              },
            }}
          >
            {job.description || "—"}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={ellipsisCellSx}>
          {job.dueDate ? format(new Date(job.dueDate), "yyyy-MM-dd") : "n/a"}
        </TableCell>
        <TableCell align="center" sx={ellipsisCellSx}>
          <Chip
            size="small"
            label={jobStatusConfig[job.status].label}
            icon={jobStatusConfig[job.status].icon}
            color={jobStatusConfig[job.status].color}
          />
        </TableCell>
        <TableCell align="center" sx={ellipsisCellSx}>
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
