import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useUsersDelete, useUsersResetPassword } from "../../../../hooks";
import { UserResponseDto } from "../../../../types";
import { PopoverMenu, PopoverMenuItem } from "../../../../components";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

interface FormFields {
  currentPassword: string;
  newPassword: string;
}

interface Props {
  user: UserResponseDto;
  onSaved: () => void;
  isReadOnly: boolean;
  isAdmin: boolean;
  isSelf: boolean;
}

export function ProfileActions({
  user,
  onSaved,
  isReadOnly,
  isAdmin,
  isSelf,
}: Props) {
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

  const menuItems = [
    {
      key: "edit",
      show: true,
      label: "Edit User",
      onClick: () => setEditOpen(true),
    },
    {
      key: "reset",
      show: isSelf || isAdmin,
      label: "Reset Password",
      onClick: () => setResetOpen(true),
    },
    {
      key: "delete",
      show: isAdmin,
      label: "Delete User",
      onClick: () => setDeleteOpen(true),
    },
  ];

  return (
    <>
      <PopoverMenu
        trigger={
          <IconButton sx={{ color: "white" }} disabled={isReadOnly}>
            <Settings />
          </IconButton>
        }
      >
        {menuItems
          .filter((item) => item.show)
          .map((item) => (
            <PopoverMenuItem
              key={item.key}
              label={item.label}
              closeOnSelect
              onClick={item.onClick}
            />
          ))}
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
