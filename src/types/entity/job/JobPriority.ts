export enum JobPriority {
  Low = 1,
  Medium = 2,
  High = 3,
}

export const jobPriorityKeyMap: Record<JobPriority, "low" | "medium" | "high"> = {
  [JobPriority.Low]: "low",
  [JobPriority.Medium]: "medium",
  [JobPriority.High]: "high",
};