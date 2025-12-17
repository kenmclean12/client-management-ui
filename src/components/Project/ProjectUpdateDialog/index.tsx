import { useMemo, useState } from "react";
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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { UniversalDialog } from "../../UniversalDialog";
import {
  Project,
  ProjectStatus,
  ProjectUpdateDto,
  RequestPriority,
  UserRole,
} from "../../../types";
import { dialogButtonStyles, selectStyles } from "../../../pages/styles";
import { useProjectsUpdate } from "../../../hooks";
import { menuProps } from "./styles";
import { textFieldStyles } from "../../Request/RequestApprovalDialog/styles";
import { useAuth } from "../../../context";

interface Props {
  project: Project;
}

export function ProjectUpdateDialog({ project }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.Pending);
  const [priority, setPriority] = useState<RequestPriority>(
    RequestPriority.Low
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { mutateAsync: updateProject } = useProjectsUpdate(project.id);
  const isAdmin = user?.role === UserRole.Admin;

  const isDirty = useMemo(() => {
    return (
      status !== project.projectStatus ||
      priority !== project.projectPriority ||
      dayjs(project.endDate ?? null).valueOf() !==
        dayjs(endDate ?? null).valueOf()
    );
  }, [
    status,
    priority,
    endDate,
    project.projectStatus,
    project.projectPriority,
    project.endDate,
  ]);

  const handleSave = async () => {
    await updateProject({
      id: project.id,
      dto: {
        projectStatus: status,
        projectPriority: priority,
        endDate: endDate ? endDate.toISOString() : null,
      } as unknown as ProjectUpdateDto,
    });
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setStatus(project.projectStatus);
    setPriority(project.projectPriority);
    setEndDate(project.endDate ? dayjs(project.endDate) : null);
  };

  const onClose = () => {
    setOpen(false);
    setStatus(ProjectStatus.Pending);
    setPriority(RequestPriority.Low);
    setEndDate(null);
  };

  return (
    <>
      <IconButton
        sx={{ color: "white" }}
        onClick={handleOpen}
        disabled={!isAdmin}
      >
        <Edit />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={onClose}
        title="Update Project"
        footer={
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={dialogButtonStyles}
            disabled={!isDirty}
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
                setStatus(Number(e.target.value) as ProjectStatus)
              }
            >
              {Object.entries(ProjectStatus)
                .filter(
                  ([key, val]) => typeof val === "number" && key !== "Done"
                )
                .map(([key, val]) => (
                  <MenuItem key={val} value={val}>
                    {key === "InProgress" ? "In Progress" : key}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: "white" }}>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              sx={selectStyles}
              MenuProps={menuProps}
              onChange={(e) =>
                setPriority(Number(e.target.value) as RequestPriority)
              }
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(value: Dayjs | null) => setEndDate(value)}
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
