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
  Box,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { UserResponseDto, UserRole, UserUpdateDto } from "../../../../../types";
import { useUsersUpdate } from "../../../../../hooks";
import { UniversalDialog } from "../../../../../components";
import { iconButtonStyles, selectMenuProps } from "./styles";
import { selectStyles, textFieldStyles } from "../../../../styles";

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

  function handleImageInput(
    e: React.ChangeEvent<HTMLInputElement>,
    onLoad: (dataUrl: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onLoad(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Edit User"
      footer={
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button onClick={onClose} sx={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2.5}>
        <Stack alignItems="center" spacing={1}>
          <Box sx={{ position: "relative", pb: 2 }}>
            <Avatar
              src={formData.avatarUrl ?? ""}
              sx={{ width: 96, height: 96 }}
            />
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              sx={iconButtonStyles}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                handleImageInput(e, (avatarUrl) =>
                  setFormData((p) => ({ ...p, avatarUrl }))
                )
              }
            />
          </Box>
        </Stack>
        <TextField
          label="First Name"
          value={formData.firstName}
          sx={textFieldStyles}
          onChange={(e) =>
            setFormData((p) => ({ ...p, firstName: e.target.value }))
          }
        />

        <TextField
          label="Last Name"
          value={formData.lastName}
          sx={textFieldStyles}
          onChange={(e) =>
            setFormData((p) => ({ ...p, lastName: e.target.value }))
          }
        />

        <TextField
          label="Username"
          value={formData.userName}
          sx={textFieldStyles}
          onChange={(e) =>
            setFormData((p) => ({ ...p, userName: e.target.value }))
          }
        />

        <TextField
          label="Email"
          value={formData.email}
          sx={textFieldStyles}
          onChange={(e) =>
            setFormData((p) => ({ ...p, email: e.target.value }))
          }
        />

        <FormControl fullWidth>
          <InputLabel
            sx={{
              color: "white",
              "&.Mui-focused": {
                color: "white",
              },
            }}
          >
            Role
          </InputLabel>
          <Select
            value={formData.role}
            label="Role"
            sx={selectStyles}
            MenuProps={selectMenuProps}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                role: e.target.value as UserRole,
              }))
            }
          >
            <MenuItem value={UserRole.Admin}>Admin</MenuItem>
            <MenuItem value={UserRole.Standard}>Standard</MenuItem>
            <MenuItem value={UserRole.ReadOnly}>Read Only</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </UniversalDialog>
  );
}
