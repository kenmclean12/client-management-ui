import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { get, post, put, del } from "../../lib/api";
import type { Project, ProjectCreateDto, ProjectUpdateDto } from "../../types";

export function useProjectsGetAll() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => get<Project[]>("/project"),
  });
}

export function useProjectsGetById(id: number) {
  return useQuery<Project>({
    queryKey: ["projects", id],
    queryFn: () => get<Project>(`/project/${id}`),
  });
}

export function useProjectsGetByUserId(userId: number) {
  return useQuery<Project[]>({
    queryKey: ["projects", "user", userId],
    queryFn: () => get<Project[]>(`/project/user/${userId}`),
    enabled: !!userId,
  });
}


export function useProjectsGetByClient(clientId: number) {
  return useQuery<Project[]>({
    queryKey: ["projects", "client", clientId],
    queryFn: () => get<Project[]>(`/project/client/${clientId}`),
  });
}

export function useProjectsCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: ProjectCreateDto) => post<Project>("/project", dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      enqueueSnackbar("Project created successfully", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}

export function useProjectsUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: ProjectUpdateDto }) =>
      put<Project>(`/project/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects", id] });
      enqueueSnackbar("Project updated successfully", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}

export function useProjectsDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => del<void>(`/project/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects", id] });
      enqueueSnackbar("Project deleted", {
        variant: "success",
      });
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });
}
