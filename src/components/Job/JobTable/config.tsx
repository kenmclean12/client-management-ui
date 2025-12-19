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
    color: string;
    icon: JSX.Element;
  }
> = {
  [JobStatus.Stopped]: {
    label: "Not Started",
    color: "#9e9e9e",
    icon: <PauseCircle fontSize="small" />,
  },
  [JobStatus.Pending]: {
    label: "Blocked",
    color: "#fbc02d",
    icon: <HourglassEmpty fontSize="small" />,
  },
  [JobStatus.InProgress]: {
    label: "In Progress",
    color: "#42a5f5",
    icon: <PlayCircle fontSize="small" />,
  },
  [JobStatus.Done]: {
    label: "Completed",
    color: "#4caf50",
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
