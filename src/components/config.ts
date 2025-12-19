import { RequestPriority } from "../types";

export const priorityColorConfig: Record<
  RequestPriority,
  {
    backgroundColor: string;
    color: string;
    borderColor: string;
  }
> = {
  [RequestPriority.Low]: {
    backgroundColor: "#444",
    color: "white",
    borderColor: "#444",
  },
  [RequestPriority.Normal]: {
    backgroundColor: "#fbc02d",
    color: "white",
    borderColor: "white",
  },
  [RequestPriority.High]: {
    backgroundColor: "#f44336",
    color: "white",
    borderColor: "white",
  },
};