/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  IconButton,
  Stack,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import {
  Request,
  RequestPriority,
  RequestStatus,
  RequestUpdateDto,
} from "../../../types";
import { dialogButtonStyles, selectStyles } from "../../../pages/styles";
import { useRequestsUpdate } from "../../../hooks";
import { menuProps } from "./styles";

interface Props {
  request: Request;
}

export function RequestUpdateDialog({ request }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [priority, setPriority] = useState<RequestPriority>(request.priority);
  const { mutateAsync: updateRequest } = useRequestsUpdate(request.id);

  const handleSave = async () => {
    await updateRequest({
      id: request.id,
      dto: {
        status,
        priority,
      } as unknown as RequestUpdateDto,
    });
    setOpen(false);
  };

  return (
    <>
      <IconButton sx={{ color: "white" }} onClick={() => setOpen(true)}>
        <Edit />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Update Request"
        footer={
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={dialogButtonStyles}
          >
            Update
          </Button>
        }
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: "white" }}>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              sx={selectStyles}
              MenuProps={menuProps}
              onChange={(e) =>
                setStatus(Number(e.target.value) as RequestStatus)
              }
            >
              {Object.entries(RequestStatus)
                .filter(
                  ([key, val]) => typeof val === "number" && key !== "Approved"
                )
                .map(([key, val]) => (
                  <MenuItem key={val} value={val}>
                    {key}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: "white" }}>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              MenuProps={menuProps}
              sx={selectStyles}
              onChange={(e) => setPriority(e.target.value as RequestPriority)}
            >
              {[
                RequestPriority.Low,
                RequestPriority.Normal,
                RequestPriority.High,
              ].map((p) => (
                <MenuItem key={p} value={p}>
                  {p === RequestPriority.Low
                    ? "Low"
                    : p === RequestPriority.Normal
                    ? "Normal"
                    : "High"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </UniversalDialog>
    </>
  );
}
