export enum JobPriority {
  Low = 1,
  Medium = 2,
  High = 3,
}

export const jobPriorityKeyMap: Record<JobPriority, "Low" | "Medium" | "High"> =
  {
    [JobPriority.Low]: "Low",
    [JobPriority.Medium]: "Medium",
    [JobPriority.High]: "High",
  };
