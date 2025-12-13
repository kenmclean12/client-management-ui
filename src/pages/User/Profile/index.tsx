/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Stack,
  Avatar,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  Person,
  Email,
  CalendarToday,
  Update,
  AdminPanelSettings,
  Badge,
  AccountCircle,
  Settings,
  Save,
  Cancel,
  Delete,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import {
  useUsersGetById,
  useUsersUpdate,
  useUsersDelete,
} from "../../../hooks";
import { UserRole, UserUpdateDto } from "../../../types";
import { PopoverMenu, PopoverMenuItem } from "../../../components/PopoverMenu";
import { useAuth } from "../../../context/authContext";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: self } = useAuth();
  const userId = id ? parseInt(id, 10) : 0;

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserUpdateDto>({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    role: UserRole.ReadOnly,
    avatarUrl: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isAdmin = Number(id) === Number(self?.id);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useUsersGetById(userId, {
    enabled: userId > 0,
  });

  const updateMutation = useUsersUpdate(userId);
  const deleteMutation = useUsersDelete(userId);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName ?? "",
        email: user.email ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        role: (user.role as UserRole) ?? UserRole.ReadOnly,
        avatarUrl: user.avatarUrl ?? "",
      });
    }
  }, [user]);

  const handleInputChange =
    (field: keyof UserUpdateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setSaveError(null);
    };

  const handleSelectChange = (field: keyof UserUpdateDto) => (e: any) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setSaveError(null);
  };

  const handleSave = async () => {
    try {
      const changes: Partial<UserUpdateDto> = {};
      if (formData.userName !== user?.userName)
        changes.userName = formData.userName;
      if (formData.email !== user?.email) changes.email = formData.email;
      if (formData.firstName !== user?.firstName)
        changes.firstName = formData.firstName;
      if (formData.lastName !== user?.lastName)
        changes.lastName = formData.lastName;
      if (formData.role !== user?.role) changes.role = formData.role;
      if (formData.avatarUrl !== user?.avatarUrl)
        changes.avatarUrl = formData.avatarUrl;

      if (Object.keys(changes).length === 0) {
        setEditMode(false);
        return;
      }

      await updateMutation.mutateAsync({ id: userId, dto: changes as UserUpdateDto });
      await refetch();
      setEditMode(false);
      setSaveError(null);
    } catch (err: any) {
      setSaveError(err.message || "Failed to update user");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
      navigate("/users");
    } catch (err: any) {
      setSaveError(err.message || "Failed to delete user");
      setDeleteDialogOpen(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        userName: user.userName ?? "",
        email: user.email ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        role: (user.role as UserRole) ?? UserRole.ReadOnly,
        avatarUrl: user.avatarUrl ?? "",
      });
    }
    setEditMode(false);
    setSaveError(null);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h6" color="error">
          User not found or error loading user data.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
        <Paper elevation={3} sx={{ p: 4, position: "relative" }}>
          {isAdmin && (
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
              <PopoverMenu
                trigger={
                  <IconButton sx={{ color: "text.secondary" }}>
                    <Settings />
                  </IconButton>
                }
              >
                <PopoverMenuItem
                  label={editMode ? "Cancel Editing" : "Edit User"}
                  closeOnSelect
                  onClick={() =>
                    editMode ? handleCancel() : setEditMode(true)
                  }
                />
                <Divider />
                <PopoverMenuItem
                  label="Delete User"
                  closeOnSelect
                  onClick={() => setDeleteDialogOpen(true)}
                  iconRight={<Delete sx={{ color: "error.main" }} />}
                />
              </PopoverMenu>
            </Box>
          )}

          {saveError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {saveError}
            </Alert>
          )}

          <Stack spacing={4}>
            {/* Top Header */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems={{ xs: "center", sm: "flex-start" }}
            >
              <Avatar
                src={user.avatarUrl || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: user.avatarUrl ? undefined : "grey.400",
                  fontSize: "3rem",
                }}
              >
                {user.avatarUrl ? "" : <Person sx={{ fontSize: 60 }} />}
              </Avatar>

              <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  @{user.userName}
                </Typography>
                <Box
                  display="flex"
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                  alignItems="center"
                  gap={2}
                  mt={1}
                >
                  <Chip
                    icon={<AdminPanelSettings />}
                    label={user.role}
                    variant="outlined"
                    size="medium"
                  />
                </Box>
              </Box>
            </Stack>

            {/* Bottom Info Section */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
              {/* Personal Information */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <AccountCircle /> Personal Information
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Full Name
                    </Typography>
                    {editMode ? (
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange("firstName")}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange("lastName")}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                      </Stack>
                    ) : (
                      <Typography variant="body1">
                        {user.firstName} {user.lastName}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Username
                    </Typography>
                    {editMode ? (
                      <TextField
                        value={formData.userName}
                        onChange={handleInputChange("userName")}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Badge fontSize="small" /> {user.userName}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    {editMode ? (
                      <TextField
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Email fontSize="small" /> {user.email}
                      </Typography>
                    )}
                  </Box>

                  {editMode && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Avatar URL
                      </Typography>
                      <TextField
                        value={formData.avatarUrl}
                        onChange={handleInputChange("avatarUrl")}
                        placeholder="https://example.com/avatar.jpg"
                        size="small"
                        fullWidth
                      />
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Account Information */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <AdminPanelSettings /> Account Information
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="body1">#{user.id}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Role
                    </Typography>
                    {editMode ? (
                      <FormControl size="small" fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={formData.role}
                          onChange={handleSelectChange("role")}
                          label="Role"
                        >
                          <MenuItem value={UserRole.Admin}>Admin</MenuItem>
                          <MenuItem value={UserRole.Standard}>
                            Standard
                          </MenuItem>
                          <MenuItem value={UserRole.ReadOnly}>
                            ReadOnly
                          </MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography variant="body1">{user.role}</Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <CalendarToday fontSize="small" /> Created
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(user.createdAt), "PPP")}
                    </Typography>
                  </Box>

                  {user.updatedAt && (
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Update fontSize="small" /> Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(user.updatedAt), "PPP")}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Stack>

            {editMode && isAdmin && (
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                sx={{ mt: 3 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete User"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
