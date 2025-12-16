import { RequestStatus } from "../../types";

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
