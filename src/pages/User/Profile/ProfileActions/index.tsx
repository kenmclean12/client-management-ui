import { useState } from "react";
import { IconButton } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { UserResponseDto } from "../../../../types";
import {
  DeleteUserDialog,
  EditUserDialog,
  PopoverMenu,
  PopoverMenuItem,
  ResetPasswordDialog,
} from "../../../../components";

interface Props {
  user: UserResponseDto;
  isReadOnly: boolean;
  isAdmin: boolean;
  isSelf: boolean;
}

export function ProfileActions({ user, isReadOnly, isAdmin, isSelf }: Props) {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [resetOpen, setResetOpen] = useState<boolean>(false);

  const menuItems = [
    {
      key: "edit",
      show: true,
      label: "Edit User",
      onClick: () => setEditOpen(true),
    },
    {
      key: "reset",
      show: isSelf,
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
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
      <DeleteUserDialog
        user={user}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
      <ResetPasswordDialog
        userId={user?.id}
        open={resetOpen}
        onClose={() => setResetOpen(false)}
      />
    </>
  );
}
