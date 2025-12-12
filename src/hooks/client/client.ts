import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../lib/api";
import type { Client, ClientCreateDto, ClientUpdateDto } from "../../types";

export function useClientsGetAll() {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => get<Client[]>("/client"),
  });
}

export function useClientsGetById(id: number) {
  return useQuery<Client>({
    queryKey: ["client", id],
    queryFn: () => get<Client>(`/client/${id}`),
  });
}

export function useClientsCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ClientCreateDto) => post<Client>("/client", dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useClientsUpdate(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; dto: ClientUpdateDto }) =>
      put<Client>(`/client/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", id] });
    },
  });
}

export function useClientsDelete(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => del<void>(`/client/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", id] });
    },
  });
}
