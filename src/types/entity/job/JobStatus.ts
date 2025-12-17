export enum JobStatus {
  Stopped = 1,
  Pending = 2,
  InProgress = 3,
  Done = 4,
}

export const jobStatusKeyMap: Record<
  JobStatus,
  "Not Started" | "In Progress" | "Completed" | "Blocked"
> = {
  [JobStatus.Stopped]: "Not Started",
  [JobStatus.Pending]: "Blocked",
  [JobStatus.InProgress]: "In Progress",
  [JobStatus.Done]: "Completed",
};
