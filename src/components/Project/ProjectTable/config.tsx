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
    color: "default" | "warning" | "info" | "success";
    icon: JSX.Element;
  }
> = {
  [ProjectStatus.Stopped]: {
    label: "Stopped",
    color: "default",
    icon: <PauseCircle fontSize="small" />,
  },
  [ProjectStatus.Pending]: {
    label: "Pending",
    color: "warning",
    icon: <HourglassEmpty fontSize="small" />,
  },
  [ProjectStatus.InProgress]: {
    label: "In Progress",
    color: "info",
    icon: <PlayCircle fontSize="small" />,
  },
  [ProjectStatus.Done]: {
    label: "Done",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },
};
