/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Stack,
  Avatar,
  Typography,
  Box,
  Paper,
  Chip,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Person,
  Email,
  CalendarToday,
  Update,
  AdminPanelSettings,
  Save,
  PhotoCamera,
  Cancel,
  Send,
} from "@mui/icons-material";
import { useAuth } from "../../../context/authContext";
import { useUsersGetById, useUsersUpdate } from "../../../hooks";
import {
  UserResponseDto,
  UserRole,
  UserRoleLabel,
  UserUpdateDto,
} from "../../../types";
import { PageShell } from "../../../components";
import { format } from "date-fns";
import { ProfileActions } from "./components";
import { innerBoxStyles, paperStyles } from "./styles";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: self } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserUpdateDto>({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    role: UserRole.ReadOnly,
    avatarUrl: "",
  });

  const { data: user, refetch } = useUsersGetById(Number(id), {
    enabled: Number(id) > 0,
  });
  const updateMutation = useUsersUpdate(Number(id));

  const isAdmin = self?.role === UserRole.Admin;
  const isSelf = Number(id) === Number(self?.id);

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
    };

  const handleSelectChange = (field: keyof UserUpdateDto) => (e: any) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
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
  };

  const handleSave = async () => {
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

    await updateMutation.mutateAsync({
      id: Number(id),
      dto: changes as UserUpdateDto,
    });
    await refetch();
    setEditMode(false);
  };

  return (
    <PageShell
      title="User"
      icon={<Person />}
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
                editMode={editMode}
                setEditMode={setEditMode}
                onCancelEdit={handleCancel}
              />
            </Box>
          )}
          <Stack spacing={4}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "center", sm: "flex-start" }}
              spacing={3}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={formData.avatarUrl || undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: formData.avatarUrl ? undefined : "grey.400",
                    fontSize: "3rem",
                  }}
                >
                  {!formData.avatarUrl && <Person sx={{ fontSize: 60 }} />}
                </Avatar>
                {editMode && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      bgcolor: "background.paper",
                      border: "1px solid #ccc",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PhotoCamera />
                  </IconButton>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </Box>
              <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {formData.firstName} {formData.lastName}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  @{formData.userName}
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
                    label={UserRoleLabel[user?.role as UserRole]}
                    variant="outlined"
                    size="medium"
                  />
                </Box>
              </Box>
            </Stack>
            {editMode && (isAdmin || isSelf) && (
              <Stack direction="column" spacing={2}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                  size="small"
                />
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  size="small"
                />
                <TextField
                  label="Username"
                  value={formData.userName}
                  onChange={handleInputChange("userName")}
                  size="small"
                />
                <TextField
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  size="small"
                  type="email"
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={handleSelectChange("role")}
                    label="Role"
                    disabled={!isAdmin}
                  >
                    <MenuItem value={UserRole.Admin}>Admin</MenuItem>
                    <MenuItem value={UserRole.Standard}>Standard</MenuItem>
                    <MenuItem value={UserRole.ReadOnly}>ReadOnly</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            )}
            {editMode && (
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
                  Save
                </Button>
              </Stack>
            )}
            {!editMode && (
              <Stack direction="column" spacing={2} mt={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    <Email fontSize="small" sx={{ mr: 1 }} />
                    {user?.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    {user?.createdAt
                      ? format(new Date(user?.createdAt), "PPP")
                      : "n/a"}
                  </Typography>
                </Box>
                {user?.updatedAt && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      <Update fontSize="small" sx={{ mr: 1 }} />
                      {format(new Date(user?.updatedAt), "PPP")}
                    </Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Box>
    </PageShell>
  );
}
