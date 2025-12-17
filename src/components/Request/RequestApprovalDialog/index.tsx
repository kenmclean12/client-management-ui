/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, IconButton, Stack } from "@mui/material";
import { Check } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import {
  Request,
  RequestStatus,
  RequestUpdateDto,
  UserResponseDto,
} from "../../../types";
import { dialogButtonStyles } from "../../../pages/styles";
import { UserSelect } from "../../User";
import { useRequestsUpdate, useUsersGetAllAdmins } from "../../../hooks";
import { textFieldStyles } from "./styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface EditingRequest {
  id: number | null;
  data: RequestUpdateDto;
}

interface Props {
  request: Request;
}

export function RequestApprovalDialog({ request }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [editingRequest, setEditingRequest] = useState<EditingRequest | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(
    null
  );

  const { data: users } = useUsersGetAllAdmins();
  const { mutateAsync: updateRequest } = useRequestsUpdate(
    editingRequest?.id as number
  );

  const handleApproveClick = () => {
    setEditingRequest({
      id: request.id,
      data: {
        priority: request.priority as any,
        status: RequestStatus.Approved,
        assignedUserId: null,
        dueDate: null,
      },
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editingRequest?.id) return;

    await updateRequest({
      id: editingRequest.id,
      dto: editingRequest.data,
    });

    setEditingRequest(null);
    setSelectedUser(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRequest(null);
  };

  return (
    <>
      <IconButton sx={{ color: "green" }} onClick={handleApproveClick}>
        <Check />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={handleClose}
        title="Approve Request"
        footer={
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={dialogButtonStyles}
          >
            Save
          </Button>
        }
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <UserSelect
            users={users ?? []}
            value={selectedUser}
            onChange={(user) => {
              if (!editingRequest) return;
              setSelectedUser(user);
              setEditingRequest({
                ...editingRequest,
                data: {
                  ...editingRequest.data,
                  assignedUserId: user?.id as number,
                },
              });
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due date"
              value={
                editingRequest?.data.dueDate
                  ? dayjs.utc(editingRequest.data.dueDate)
                  : null
              }
              onChange={(value: Dayjs | null) => {
                if (!editingRequest) return;
                setEditingRequest({
                  ...editingRequest,
                  data: {
                    ...editingRequest.data,
                    dueDate: value ? value.utc().toISOString() : null,
                  },
                });
              }}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  sx: textFieldStyles,
                },
              }}
            />
          </LocalizationProvider>
        </Stack>
      </UniversalDialog>
    </>
  );
}
