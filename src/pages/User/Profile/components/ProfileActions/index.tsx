import { useState } from "react";
import { IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { UserResponseDto, UserRole } from "../../../../../types";
import { useUsersDelete, useUsersResetPassword } from "../../../../../hooks";
import { PopoverMenu, PopoverMenuItem } from "../../../../../components";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { EditUserDialog } from "./EditUserDialog";

interface FormFields {
  currentPassword: string;
  newPassword: string;
}

interface Props {
  user: UserResponseDto;
  self: UserResponseDto;
  onSaved: () => void;
}

export function ProfileActions({ user, self, onSaved }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState<boolean>(false);
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
          onClick={() => setEditOpen(true)}
        />
        {(isSelf || isAdmin) && (
          <PopoverMenuItem
            label="Reset Password"
            closeOnSelect
            onClick={() => setResetOpen(true)}
          />
        )}
        {isAdmin && (
          <PopoverMenuItem
            label="Delete User"
            closeOnSelect
            disabled={!isAdmin}
            onClick={() => setDeleteOpen(true)}
          />
        )}
      </PopoverMenu>
      <EditUserDialog
        open={editOpen}
        user={user}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          onSaved();
          setEditOpen(false);
        }}
      />
      <DeleteUserDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        firstName={user?.firstName}
        lastName={user?.lastName}
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
