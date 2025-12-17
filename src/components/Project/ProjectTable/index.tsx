import { Fragment, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Stack,
  Chip,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import { Work, Visibility } from "@mui/icons-material";
import { Project } from "../../../types";
import { tableContainerStyles, tableStyles } from "../../../pages/styles";
import { useNavigate } from "react-router-dom";
import { JobsDialog } from "../../Job";
import { projectPriorityConfig, projectStatusConfig } from "./config";
import { UserRow } from "../../User";
import { DescriptionDialog } from "../../DescriptionDialog";
import { ProjectCompletionDialog } from "../ProjectCompletionDialog";
import { ProjectUpdateDialog } from "../ProjectUpdateDialog";
import {
  clientNameTextStyles,
  countCardStyles,
  descriptionBoxStyles,
  noProjectsBoxStyles,
  priorityChipStyles,
  projectPaperStyles,
  tableRowStyles,
  textStyles,
  topRowContainerStyles,
} from "./styles";

interface Props {
  projects: Project[];
  clientSpecific?: boolean;
  userPage?: boolean;
}

export function ProjectTable({ projects, clientSpecific, userPage }: Props) {
  const navigate = useNavigate();
  const [openDescription, setOpenDescription] = useState<string>("");
  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString() : "—";
  const sortedProjects = [...projects].sort(
    (a, b) =>
      new Date(b.startDate || "").getTime() -
      new Date(a.startDate || "").getTime()
  );

  const now = new Date();
  const projectCounts = {
    total: sortedProjects.length,
    active: sortedProjects.filter(
      (p) => !p.endDate || new Date(p.endDate) > now
    ).length,
    completed: sortedProjects.filter(
      (p) => p.endDate && new Date(p.endDate) <= now
    ).length,
    jobs: sortedProjects.reduce((acc, p) => acc + (p.jobs?.length || 0), 0),
  };

  return (
    <Box sx={{ p: 0 }}>
      {!userPage && (
        <Stack sx={topRowContainerStyles}>
          <Card sx={countCardStyles}>
            <CardContent>
              <Typography variant="body2" color="#aaa">
                Total Projects
              </Typography>
              <Typography variant="h5" color="white">
                {projectCounts.total}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={countCardStyles}>
            <CardContent>
              <Typography variant="body2" color="#aaa">
                Total Jobs
              </Typography>
              <Typography variant="h5" color="white">
                {projectCounts.jobs}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      )}
      <Paper sx={{ ...projectPaperStyles, p: !userPage ? 3 : 0 }}>
        {sortedProjects.length === 0 ? (
          <Box sx={noProjectsBoxStyles}>
            <Work sx={{ fontSize: 56, color: "#555" }} />
            <Typography>No projects found</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ ...tableContainerStyles, height: 600 }}>
            <Table stickyHeader sx={tableStyles}>
              <TableHead>
                <TableRow>
                  {!userPage && (
                    <TableCell align="center">Assigned To</TableCell>
                  )}
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Description</TableCell>
                  {!clientSpecific && (
                    <TableCell align="center">Client</TableCell>
                  )}
                  <TableCell align="center">Timeline</TableCell>
                  <TableCell align="center">Priority</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Jobs</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProjects.map((p) => (
                  <Fragment key={p.id}>
                    <TableRow sx={tableRowStyles} hover>
                      {!userPage && (
                        <TableCell align="center" sx={{ maxWidth: 200 }}>
                          {p.assignedUser ? (
                            <UserRow
                              user={p.assignedUser}
                              onClick={() =>
                                navigate(`/users/${p.assignedUserId}`)
                              }
                              showUserName
                            />
                          ) : (
                            <Typography color="#666">—</Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell align="center" sx={{ maxWidth: 150 }}>
                        <Tooltip title={p.name} arrow>
                          <Typography sx={textStyles} noWrap>
                            {p.name}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" sx={{ maxWidth: 150 }}>
                        {p.description ? (
                          <Box
                            onClick={() =>
                              setOpenDescription(p.description ?? "")
                            }
                            sx={descriptionBoxStyles}
                          >
                            <Visibility
                              fontSize="small"
                              sx={{ color: "#777" }}
                            />
                            <Typography className="desc" sx={textStyles} noWrap>
                              {p.description}
                            </Typography>
                          </Box>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      {!clientSpecific && (
                        <TableCell align="center" sx={{ maxWidth: 180 }}>
                          {p.client ? (
                            <Tooltip title={p.client.name} arrow>
                              <Typography
                                onClick={() =>
                                  navigate(`/clients/${p.client?.id}`)
                                }
                                sx={clientNameTextStyles}
                                noWrap
                              >
                                {p.client.name}
                              </Typography>
                            </Tooltip>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      )}
                      <TableCell align="center" sx={{ maxWidth: 200 }}>
                        <Tooltip
                          title={`${formatDate(p.startDate)} → ${formatDate(
                            p.dueDate
                          )}`}
                          arrow
                        >
                          <Typography noWrap variant="body2" color="#aaa">
                            {formatDate(p.startDate)} → {formatDate(p.dueDate)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={projectPriorityConfig[p.projectPriority].label}
                          icon={projectPriorityConfig[p.projectPriority].icon}
                          sx={priorityChipStyles}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={projectStatusConfig[p.projectStatus].label}
                          icon={projectStatusConfig[p.projectStatus].icon}
                          color={projectStatusConfig[p.projectStatus].color}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <JobsDialog
                          jobs={p.jobs || []}
                          clientId={p.clientId}
                          projectId={p.id}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          justifyContent="center"
                          spacing={0.5}
                        >
                          <ProjectUpdateDialog project={p} />
                          <ProjectCompletionDialog project={p} />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      {openDescription && (
        <DescriptionDialog
          open
          title="Project Description"
          description={openDescription}
          onClose={() => setOpenDescription("")}
        />
      )}
    </Box>
  );
}
