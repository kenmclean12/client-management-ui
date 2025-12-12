import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../lib/api";
import { Request, RequestCreateDto, RequestUpdateDto } from "../../types";

export function useRequestsGetAll() {
  return useQuery<Request[]>({
    queryKey: ["requests"],
    queryFn: () => get<Request[]>("/request"),
  });
}

export function useRequestsGetById(id: number) {
  return useQuery<Request>({
    queryKey: ["requests", id],
    queryFn: () => get<Request>(`/request/${id}`),
  });
}

export function useRequestsGetByClient(id: number) {
  return useQuery<Request[]>({
    queryKey: ["requests", "client", id],
    queryFn: () => get<Request[]>(`/request/client/${id}`),
  });
}

export function useRequestsCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: RequestCreateDto) => post<Request>("/request", dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useRequestsUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: RequestUpdateDto }) =>
      put<Request>(`/request/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["requests", id] });
    },
  });
}

export function useRequestsDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => del<void>(`/request/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["requests", id] });
    },
  });
}
