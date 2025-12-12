import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../lib/api";
import { Note, NoteCreateDto, NoteUpdateDto } from "../../types";

export function useNotesGetAll() {
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: () => get<Note[]>("/notes"),
  });
}

export function useNotesGetByClient(id: number) {
  return useQuery<Note[]>({
    queryKey: ["notes", id],
    queryFn: () => get<Note[]>(`/notes/${id}`),
  });
}

export function useNotesCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: NoteCreateDto) => post<Note>("/notes", dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useNotesUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: NoteUpdateDto }) =>
      put<Note>(`/notes/${vars.id}`, vars.dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes", id] }),
  });
}

export function useNotesDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => del<void>(`/notes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["notes", id] });
    },
  });
}
