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
import { Email, CalendarToday, AdminPanelSettings } from "@mui/icons-material";
import { useUsersGetById } from "../../../hooks";
import { UserResponseDto, UserRole, UserRoleLabel } from "../../../types";
import { PageShell, UserInviteForm } from "../../../components";
import { ProfileActions } from "./ProfileActions";
import { useAuth } from "../../../context";
import { format } from "date-fns";
import { paperStyles } from "./styles";

const ellipsis = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: self } = useAuth();
  const { data: user, refetch } = useUsersGetById(Number(id), {
    enabled: Number(id) > 0,
  });
  const isReadOnly = self?.role === UserRole.ReadOnly;
  const isAdmin = self?.role === UserRole.Admin;
  const isSelf = Number(id) === Number(self?.id);

  return (
    <PageShell title="Users" actions={<UserInviteForm />}>
      <Box px={4} pt={4}>
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
            <Stack sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={ellipsis}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={ellipsis}
                mt={0.5}
              >
                @{user?.userName}
              </Typography>
              <Chip
                size="small"
                icon={<AdminPanelSettings />}
                label={UserRoleLabel[user?.role as UserRole]}
                sx={{ mt: 1.5 }}
              />
            </Stack>
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Stack direction="row" spacing={4} sx={{ rowGap: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" width="50%">
              <Email fontSize="small" />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography sx={ellipsis}>{user?.email ?? "n/a"}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center" width="50%">
              <CalendarToday fontSize="small" />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">
                  Joined
                </Typography>
                <Typography sx={ellipsis}>
                  {user?.createdAt
                    ? format(new Date(user.createdAt), "PPP")
                    : "n/a"}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </PageShell>
  );
}
