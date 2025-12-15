import { useParams } from "react-router-dom";
import {
  Stack,
  Avatar,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import {
  Email,
  CalendarToday,
  AdminPanelSettings,
  Work,
  PendingActions,
} from "@mui/icons-material";
import { format } from "date-fns";

import { useUsersGetById } from "../../../hooks";
import { useProjectsGetByUserId, useJobsGetByUserId } from "../../../hooks";
import { UserResponseDto, UserRole, UserRoleLabel } from "../../../types";
import { PageShell, UserInviteForm } from "../../../components";
import { ProfileActions } from "./ProfileActions";
import { useAuth } from "../../../context";
import { ellipsisTextStyles, paperStyles } from "./styles";

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const { user: self } = useAuth();

  const { data: user, refetch } = useUsersGetById(userId, {
    enabled: userId > 0,
  });
  const { data: projects = [] } = useProjectsGetByUserId(userId);
  const { data: jobs = [] } = useJobsGetByUserId(userId);

  const isSelf = userId === Number(self?.id);
  const isReadOnly = self?.role === UserRole.ReadOnly;
  const isAdmin = self?.role === UserRole.Admin;

  const jobsByProject = jobs.reduce<Record<number, typeof jobs>>((acc, job) => {
    if (!job.projectId) return acc;
    acc[job.projectId] ??= [];
    acc[job.projectId].push(job);
    return acc;
  }, {});

  return (
    <PageShell title="Users" actions={<UserInviteForm />}>
      <Box p={2}>
        <Paper elevation={2} sx={paperStyles}>
          {(isAdmin || isSelf) && (
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
              <ProfileActions
                user={user as UserResponseDto}
                onSaved={refetch}
                isReadOnly={isReadOnly}
                isAdmin={isAdmin}
                isSelf={isSelf}
              />
            </Box>
          )}
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar src={user?.avatarUrl} sx={{ width: 96, height: 96 }} />
            <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography fontSize="20px" sx={ellipsisTextStyles}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Chip
                  size="small"
                  icon={<AdminPanelSettings />}
                  label={UserRoleLabel[user?.role as UserRole]}
                  sx={{ backgroundColor: "white", width: "fit-content" }}
                />
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={ellipsisTextStyles}
              >
                @{user?.userName}
              </Typography>
              <Stack
                direction="row"
                spacing={4}
                flexWrap="wrap"
                rowGap={1}
                pt={0.75}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Email fontSize="small" sx={{ color: "white" }} />
                  <Typography fontSize={14} sx={ellipsisTextStyles}>
                    {user?.email ?? "n/a"}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarToday fontSize="small" sx={{ color: "white" }} />
                  <Typography fontSize={14} color="white">
                    Joined:{" "}
                    {user?.createdAt
                      ? format(new Date(user.createdAt), "PPP")
                      : "n/a"}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          {user?.role === UserRole.Admin && (
            <Stack width="100%">
              <Divider sx={{ my: 2, backgroundColor: "#444" }} />
              <Box pb={2}>
                <Typography fontSize="16px" color="white" mb={2}>
                  Assigned Projects
                </Typography>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={2}
                  py={5}
                  width="100%"
                  border="1px solid #444"
                  sx={{ backgroundColor: "#1e1e1e" }}
                >
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <Paper key={project.id} variant="outlined" sx={{ p: 2 }}>
                        <Typography fontWeight={600} sx={ellipsisTextStyles}>
                          {project.name}
                        </Typography>

                        {project.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={0.5}
                          >
                            {project.description}
                          </Typography>
                        )}

                        {jobsByProject[project.id]?.length > 0 && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={1}>
                              {jobsByProject[project.id].map((job) => (
                                <Box key={job.id}>
                                  <Typography
                                    fontSize={14}
                                    fontWeight={500}
                                    sx={ellipsisTextStyles}
                                  >
                                    {job.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={ellipsisTextStyles}
                                  >
                                    {job.status} · {job.priority}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </>
                        )}
                      </Paper>
                    ))
                  ) : (
                    <Box textAlign="center">
                      <Work sx={{ fontSize: 40, color: "#ccc" }} />
                      <Typography fontSize={16} color="#ccc">
                        No Projects Found
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Stack>
          )}
          <Stack width="100%">
            <Divider sx={{ my: 2, backgroundColor: "#444" }} />
            <Box pb={1}>
              <Typography fontSize="16px" color="white" mb={2}>
                Assigned Jobs
              </Typography>
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={2}
                py={5}
                width="100%"
                border="1px solid #444"
                sx={{ backgroundColor: "#1e1e1e" }}
              >
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <Paper key={job.id} variant="outlined" sx={{ p: 2 }}>
                      <Typography fontWeight={600} sx={ellipsisTextStyles}>
                        {job.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.status} · {job.priority}
                      </Typography>
                      {job.dueDate && (
                        <Typography variant="caption" color="text.secondary">
                          Due {format(new Date(job.dueDate), "PPP")}
                        </Typography>
                      )}
                    </Paper>
                  ))
                ) : (
                  <Box textAlign="center">
                    <PendingActions sx={{ fontSize: 40, color: "#ccc" }} />
                    <Typography fontSize={16} color="#ccc">
                      No Jobs Found
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
          <Divider sx={{ mt: 3, backgroundColor: "#444" }} />
        </Paper>
      </Box>
    </PageShell>
  );
}
