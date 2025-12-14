import { useState } from "react";
import { IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { UserResponseDto, UserRole } from "../../../../../types";
import { useUsersDelete, useUsersResetPassword } from "../../../../../hooks";
import { PopoverMenu, PopoverMenuItem } from "../../../../../components";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

interface FormFields {
  currentPassword: string;
  newPassword: string;
}

interface Props {
  user: UserResponseDto;
  self: UserResponseDto;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  onCancelEdit: () => void;
}

export function ProfileActions({
  user,
  self,
  editMode,
  setEditMode,
  onCancelEdit,
}: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [resetPassword, setResetPassword] = useState<FormFields>({
    currentPassword: "",
    newPassword: "",
  });

  const deleteMutation = useUsersDelete(Number(id));
  const resetMutation = useUsersResetPassword(Number(id));

  const isAdmin = self?.role === UserRole.Admin;
  const isSelf = Number(id) === Number(self?.id);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
    navigate("/users");
  };

  const handleResetPassword = async () => {
    await resetMutation.mutateAsync({
      id: Number(id),
      dto: {
        password: resetPassword.currentPassword,
        newPassword: resetPassword.newPassword,
      },
    });
    setResetOpen(false);
    setResetPassword({ currentPassword: "", newPassword: "" });
  };

  if (!isAdmin && !isSelf) return null;

  return (
    <>
      <PopoverMenu
        trigger={
          <IconButton sx={{ color: "text.secondary" }}>
            <Settings />
          </IconButton>
        }
      >
        <PopoverMenuItem
          label="Edit User"
          closeOnSelect
          onClick={() => (editMode ? onCancelEdit() : setEditMode(true))}
        />
        <PopoverMenuItem
          label="Delete User"
          onClick={() => setDeleteOpen(true)}
          disabled={!isAdmin}
          closeOnSelect
        />
        {isSelf && (
          <PopoverMenuItem
            label="Reset Password"
            onClick={() => setResetOpen(true)}
            closeOnSelect
          />
        )}
      </PopoverMenu>
      <DeleteUserDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        firstName={user.firstName}
        lastName={user.lastName}
      />
      <ResetPasswordDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleResetPassword}
        isPending={resetMutation.isPending}
        currentPassword={resetPassword.currentPassword}
        newPassword={resetPassword.newPassword}
        onCurrentPasswordChange={(v) =>
          setResetPassword((p) => ({ ...p, currentPassword: v }))
        }
        onNewPasswordChange={(v) =>
          setResetPassword((p) => ({ ...p, newPassword: v }))
        }
      />
    </>
  );
}
