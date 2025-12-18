import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { get, post, put, del } from "../../lib/api";
import type { Note, NoteCreateDto, NoteUpdateDto } from "../../types";

export function useNotesGetAll() {
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: () => get<Note[]>("/notes"),
  });
}

export function useNotesGetByClient(id: number) {
  return useQuery<Note[]>({
    queryKey: ["notes", id],
    queryFn: () => get<Note[]>(`/notes/client/${id}`),
  });
}

export function useNotesGetByProject(projectId: number) {
  return useQuery<Note[]>({
    queryKey: ["notes", "project", projectId],
    queryFn: () => get<Note[]>(`/notes/project/${projectId}`),
  });
}

export function useNotesGetByJob(jobId: number) {
  return useQuery<Note[]>({
    queryKey: ["notes", "job", jobId],
    queryFn: () => get<Note[]>(`/notes/job/${jobId}`),
  });
}

export function useNotesCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: NoteCreateDto) => post<Note>("/notes", dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      enqueueSnackbar("Note created successfully", {
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

export function useNotesUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: NoteUpdateDto }) =>
      put<Note>(`/notes/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["notes", id] });
      enqueueSnackbar("Note updated successfully", {
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

export function useNotesDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => del<void>(`/notes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["notes", id] });
      enqueueSnackbar("Note deleted", {
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
