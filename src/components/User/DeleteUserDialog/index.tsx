import { Button, Typography } from "@mui/material";
import { UniversalDialog } from "../../../components";
import { dialogButtonStyles } from "../../../pages/styles";
import { useAuth } from "../../../context";
import { UserResponseDto, UserRole } from "../../../types";
import { useUsersDelete } from "../../../hooks";

interface Props {
  user: UserResponseDto;
  open: boolean;
  onClose: () => void;
}

export function DeleteUserDialog({ user, open, onClose }: Props) {
  const { user: self } = useAuth();
  const isAdmin = self?.role === UserRole.Admin;
  const { mutateAsync: deleteUser } = useUsersDelete(Number(user?.id));

  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Delete User"
      footer={
        <Button
          onClick={async () => await deleteUser()}
          variant="outlined"
          sx={dialogButtonStyles}
          disabled={!isAdmin}
        >
          Delete
        </Button>
      }
    >
      <Typography color="white">
        Are you sure you want to delete{" "}
        <strong>
          {user.firstName} {user.lastName}
        </strong>
        ? This action cannot be undone.
      </Typography>
    </UniversalDialog>
  );
}
