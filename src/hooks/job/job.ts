import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Job, JobCreateDto, JobUpdateDto } from "../../types";
import { del, get, post, put } from "../../lib/api";

export function useJobsGetAll() {
  return useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: () => get<Job[]>("/job"),
  });
}

export function useJobsGetById(id: number) {
  return useQuery<Job>({
    queryKey: ["jobs", id],
    queryFn: () => get<Job>(`/job/${id}`),
    enabled: !!id,
  });
}

export function useJobsGetByClient(clientId: number) {
  return useQuery<Job[]>({
    queryKey: ["jobs", "client", clientId],
    queryFn: () => get<Job[]>(`/job/client/${clientId}`),
    enabled: !!clientId,
  });
}

export function useJobsCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: JobCreateDto) => post<Job>("/job", dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useJobsUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: JobUpdateDto }) =>
      put<Job>(`/job/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs", id] });
    },
  });
}

export function useJobsDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => del<void>(`/job/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs", id] });
    },
  });
}
