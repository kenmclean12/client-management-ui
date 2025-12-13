// pages/ProfilePage.tsx
import { Stack, Avatar, Typography, Box, Paper, Chip, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { 
  Person, 
  Email, 
  CalendarToday, 
  Update, 
  AdminPanelSettings,
  Badge,
  AccountCircle
} from "@mui/icons-material";
import { format } from "date-fns";
import { useUsersGetById } from "../../../hooks";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : 0;
  
  const { data: user, isLoading, error } = useUsersGetById(userId, {
    enabled: userId > 0,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">
          User not found or error loading user data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* Header with Avatar and Basic Info */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
            <Avatar
              src={user.avatarUrl || undefined}
              sx={{
                width: 120,
                height: 120,
                bgcolor: user.avatarUrl ? undefined : 'grey.400',
                fontSize: '3rem',
              }}
            >
              {user.avatarUrl ? '' : <Person sx={{ fontSize: 60 }} />}
            </Avatar>
            
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h4" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                @{user.userName}
              </Typography>
              <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                <Chip 
                  icon={<AdminPanelSettings />}
                  label={user.role}
                  variant="outlined"
                  size="medium"
                />
              </Box>
            </Box>
          </Stack>

          {/* Information Sections */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            {/* Personal Information */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountCircle /> Personal Information
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {user.firstName} {user.lastName}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Username
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge fontSize="small" /> {user.userName}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" /> {user.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Account Information */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminPanelSettings /> Account Information
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography variant="body1">
                    #{user.id}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1">
                    {user.role}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" /> Created
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(user.createdAt), 'PPP')}
                  </Typography>
                </Box>
                
                {user.updatedAt && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Update fontSize="small" /> Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(user.updatedAt), 'PPP')}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}