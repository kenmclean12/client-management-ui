/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { PhotoCamera, Save, Cancel } from "@mui/icons-material";
import { UserResponseDto, UserRole, UserUpdateDto } from "../../../../../types";
import { useUsersUpdate } from "../../../../../hooks";
import { UniversalDialog } from "../../../../../components";

interface Props {
  open: boolean;
  user: UserResponseDto;
  onClose: () => void;
  onSaved: () => void;
}

export function EditUserDialog({ open, user, onClose, onSaved }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const updateMutation = useUsersUpdate(user?.id);
  const [formData, setFormData] = useState<UserUpdateDto>({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    role: UserRole.ReadOnly,
    avatarUrl: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        userName: user.userName ?? "",
        email: user.email ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        role: user.role,
        avatarUrl: user.avatarUrl ?? "",
      });
    }
  }, [open, user]);

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      id: user.id,
      dto: formData,
    });

    onSaved();
    onClose();
  };

  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Edit User"
      footer={
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button startIcon={<Cancel />} onClick={onClose}>
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
      }
    >
      <Stack spacing={2} mt={1}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={formData.avatarUrl ?? ""}
            sx={{ width: 80, height: 80 }}
          />
          <IconButton onClick={() => fileInputRef.current?.click()}>
            <PhotoCamera />
          </IconButton>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () =>
                setFormData((p) => ({
                  ...p,
                  avatarUrl: reader.result as string,
                }));
              reader.readAsDataURL(file);
            }}
          />
        </Stack>
        <TextField
          label="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData((p) => ({ ...p, firstName: e.target.value }))
          }
        />
        <TextField
          label="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData((p) => ({ ...p, lastName: e.target.value }))
          }
        />
        <TextField
          label="Username"
          value={formData.userName}
          onChange={(e) =>
            setFormData((p) => ({ ...p, userName: e.target.value }))
          }
        />
        <TextField
          label="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData((p) => ({ ...p, email: e.target.value }))
          }
        />
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.role}
            label="Role"
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                role: e.target.value as UserRole,
              }))
            }
          >
            <MenuItem value={UserRole.Admin}>Admin</MenuItem>
            <MenuItem value={UserRole.Standard}>Standard</MenuItem>
            <MenuItem value={UserRole.ReadOnly}>ReadOnly</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </UniversalDialog>
  );
}
