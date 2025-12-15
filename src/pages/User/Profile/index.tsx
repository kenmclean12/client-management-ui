import { useParams } from "react-router-dom";
import {
  Stack,
  Avatar,
  Typography,
  Box,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Person,
  Email,
  CalendarToday,
  AdminPanelSettings,
  Group,
  Send,
} from "@mui/icons-material";
import { useUsersGetById } from "../../../hooks";
import { UserResponseDto, UserRole, UserRoleLabel } from "../../../types";
import { PageShell } from "../../../components";
import { format } from "date-fns";
import { ProfileActions } from "./components";
import { innerBoxStyles, paperStyles } from "./styles";
import { useAuth } from "../../../context";

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: self } = useAuth();
  const { data: user, refetch } = useUsersGetById(Number(id), {
    enabled: Number(id) > 0,
  });
  const isAdmin = self?.role === UserRole.Admin;
  const isSelf = Number(id) === Number(self?.id);

  return (
    <PageShell
      title="Users"
      icon={<Group />}
      actions={
        <IconButton>
          <Send sx={{ color: "white" }} />
        </IconButton>
      }
    >
      <Box sx={innerBoxStyles}>
        <Paper elevation={3} sx={paperStyles}>
          {(isAdmin || isSelf) && (
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
              <ProfileActions
                user={user as UserResponseDto}
                self={self as UserResponseDto}
                onSaved={refetch}
              />
            </Box>
          )}
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar src={user?.avatarUrl} sx={{ width: 120, height: 120 }} />
            <Box>
              <Typography variant="h4">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                @{user?.userName}
              </Typography>
              <Chip
                icon={<AdminPanelSettings />}
                label={UserRoleLabel[user?.role as UserRole]}
                variant="outlined"
                sx={{ mt: 1 }}
              />
              <Stack direction="row" spacing={4} mt={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Email fontSize="small" />
                  <Typography>{user?.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarToday fontSize="small" />
                  <Typography>
                    {user?.createdAt
                      ? format(new Date(user.createdAt), "PPP")
                      : "n/a"}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </PageShell>
  );
}
