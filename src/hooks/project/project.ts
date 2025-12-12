import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../lib/api";
import { Project, ProjectCreateDto, ProjectUpdateDto } from "../../types";

export function useProjectsGetAll() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => get<Project[]>("/projects"),
  });
}

export function useProjectsGetById(id: number) {
  return useQuery<Project>({
    queryKey: ["projects", id],
    queryFn: () => get<Project>(`/projects/${id}`),
  });
}

export function useProjectsGetByClient(clientId: number) {
  return useQuery<Project[]>({
    queryKey: ["projects", "client", clientId],
    queryFn: () => get<Project[]>(`/projects/client/${clientId}`),
  });
}

export function useProjectsCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: ProjectCreateDto) => post<Project>("/projects", dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useProjectsUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: ProjectUpdateDto }) =>
      put<Project>(`/projects/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
}

export function useProjectsDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => del<void>(`/projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
}
