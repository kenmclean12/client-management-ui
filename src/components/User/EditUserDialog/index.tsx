import { useState, useMemo, useRef } from "react";
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
import { UserResponseDto, UserRole, UserUpdateDto } from "../../../types";
import { useUsersUpdate } from "../../../hooks";
import { UniversalDialog } from "../../../components";
import {
  avatarStyles,
  iconButtonStyles,
  inputLabelStyles,
  selectMenuProps,
} from "./styles";
import {
  dialogButtonStyles,
  selectStyles,
  textFieldStyles,
} from "../../../pages/styles";
import { createUserForm, userTextFields } from "./config";

interface Props {
  user: UserResponseDto;
  open: boolean;
  onClose: () => void;
}

export function EditUserDialog({ user, open, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync: updateUser } = useUsersUpdate(user.id);
  const [initialForm, setInitialForm] = useState<UserUpdateDto>(() =>
    createUserForm(user)
  );
  const [form, setForm] = useState<UserUpdateDto>(initialForm);

  const isDirty = useMemo(() => {
    return Object.keys(form).some(
      (key) =>
        form[key as keyof UserUpdateDto] !==
        initialForm[key as keyof UserUpdateDto]
    );
  }, [form, initialForm]);

  const handleSave = async () => {
    await updateUser({
      id: user.id,
      dto: form,
    });

    setInitialForm(form);
    onClose();
  };

  function handleImageInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setForm((p) => ({ ...p, avatarUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  return (
    <UniversalDialog
      open={open}
      onClose={handleClose}
      title="Edit User"
      footer={
        <Button
          variant="outlined"
          onClick={handleSave}
          sx={dialogButtonStyles}
          disabled={!isDirty}
        >
          Save
        </Button>
      }
    >
      <Stack spacing={2.5}>
        <Stack alignItems="center">
          <Box sx={{ position: "relative", pb: 2 }}>
            <Avatar src={form.avatarUrl ?? ""} sx={avatarStyles} />
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
              onChange={handleImageInput}
            />
          </Box>
        </Stack>
        {userTextFields.map(({ key, label }) => (
          <TextField
            key={key}
            label={label}
            value={form[key] ?? ""}
            size="small"
            sx={textFieldStyles}
            onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          />
        ))}
        <FormControl fullWidth>
          <InputLabel sx={inputLabelStyles}>Role</InputLabel>
          <Select
            value={form.role}
            label="Role"
            size="small"
            sx={selectStyles}
            MenuProps={selectMenuProps}
            onChange={(e) =>
              setForm((p) => ({
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
