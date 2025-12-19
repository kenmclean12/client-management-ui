import { JSX } from "react";
import {
  PauseCircle,
  HourglassEmpty,
  PlayCircle,
  CheckCircle,
  PriorityHigh,
} from "@mui/icons-material";
import { ProjectStatus, RequestPriority } from "../../../types";

export const projectPriorityConfig: Record<
  RequestPriority,
  {
    label: string;
    icon: JSX.Element;
  }
> = {
  [RequestPriority.Low]: {
    label: "Low",
    icon: <PriorityHigh fontSize="small" />,
  },
  [RequestPriority.Normal]: {
    label: "Normal",
    icon: <PriorityHigh fontSize="small" />,
  },
  [RequestPriority.High]: {
    label: "High",
    icon: <PriorityHigh fontSize="small" />,
  },
};

export const projectStatusConfig: Record<
  ProjectStatus,
  {
    label: string;
    color: string;
    icon: JSX.Element;
  }
> = {
  [ProjectStatus.Stopped]: {
    label: "Stopped",
    color: "#9e9e9e",
    icon: <PauseCircle fontSize="small" />,
  },
  [ProjectStatus.Pending]: {
    label: "Pending",
    color: "#fbc02d",
    icon: <HourglassEmpty fontSize="small" />,
  },
  [ProjectStatus.InProgress]: {
    label: "In Progress",
    color: "#42a5f5",
    icon: <PlayCircle fontSize="small" />,
  },
  [ProjectStatus.Done]: {
    label: "Done",
    color: "#4caf50",
    icon: <CheckCircle fontSize="small" />,
  },
};

