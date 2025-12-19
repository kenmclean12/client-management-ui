import { JSX } from "react";
import {
  PauseCircle,
  HourglassEmpty,
  PlayCircle,
  CheckCircle,
  ArrowDownward,
  ArrowUpward,
  DragHandle,
} from "@mui/icons-material";
import { JobStatus, JobPriority } from "../../../types";

export const jobStatusConfig: Record<
  JobStatus,
  {
    label: string;
    color: "default" | "warning" | "info" | "success";
    icon: JSX.Element;
  }
> = {
  [JobStatus.Stopped]: {
    label: "Not Started",
    color: "default",
    icon: <PauseCircle fontSize="small" />,
  },
  [JobStatus.Pending]: {
    label: "Blocked",
    color: "warning",
    icon: <HourglassEmpty fontSize="small" />,
  },
  [JobStatus.InProgress]: {
    label: "In Progress",
    color: "info",
    icon: <PlayCircle fontSize="small" />,
  },
  [JobStatus.Done]: {
    label: "Completed",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },
};

export const jobPriorityConfig: Record<
  JobPriority,
  {
    label: string;
    icon: JSX.Element;
  }
> = {
  [JobPriority.Low]: {
    label: "Low",
    icon: <ArrowDownward fontSize="small" />,
  },
  [JobPriority.Medium]: {
    label: "Medium",
    icon: <DragHandle fontSize="small" />,
  },
  [JobPriority.High]: {
    label: "High",
    icon: <ArrowUpward fontSize="small" />,
  },
};
