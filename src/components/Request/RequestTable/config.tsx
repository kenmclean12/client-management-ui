import { JSX } from "react";
import { Block, CheckCircle, NewReleases, Pending } from "@mui/icons-material";
import { RequestPriority, RequestStatus } from "../../../types";

export const priorityConfig: Record<RequestPriority, string> = {
  [RequestPriority.Low]: "Low",
  [RequestPriority.Normal]: "Normal",
  [RequestPriority.High]: "High",
};

export const statusConfig: Record<
  RequestStatus,
  {
    label: string;
    color: "info" | "warning" | "success" | "error";
    icon: JSX.Element;
  }
> = {
  [RequestStatus.New]: {
    label: "New",
    color: "info",
    icon: <NewReleases fontSize="small" />,
  },
  [RequestStatus.Reviewed]: {
    label: "Reviewed",
    color: "warning",
    icon: <Pending fontSize="small" />,
  },
  [RequestStatus.Approved]: {
    label: "Approved",
    color: "success",
    icon: <CheckCircle fontSize="small" />,
  },
  [RequestStatus.Rejected]: {
    label: "Rejected",
    color: "error",
    icon: <Block fontSize="small" />,
  },
};

export const statusLabels = (sortedRequests: { status: RequestStatus }[]) => [
  {
    label: "New",
    count: sortedRequests.filter((r) => r.status === RequestStatus.New).length,
  },
  {
    label: "Pending",
    count: sortedRequests.filter((r) => r.status === RequestStatus.Reviewed)
      .length,
  },
];

export const tableHeaders = [
  "Client",
  "Title",
  "Created",
  "Description",
  "Priority",
  "Status",
  "Actions",
];
