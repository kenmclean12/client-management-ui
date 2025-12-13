export enum JobStatus {
  Stopped = 1,
  Pending = 2,
  InProgress = 3,
  Done = 4,
}

export const jobStatusKeyMap: Record<JobStatus, "not_started" | "in_progress" | "completed" | "blocked"> = {
  [JobStatus.Stopped]: "not_started",
  [JobStatus.Pending]: "blocked",
  [JobStatus.InProgress]: "in_progress",
  [JobStatus.Done]: "completed",
};