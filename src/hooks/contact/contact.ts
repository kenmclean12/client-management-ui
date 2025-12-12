import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "../../lib/api";
import { Contact, ContactCreateDto, ContactUpdateDto } from "../../types";

export function useContactsGetAll() {
  return useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: () => get<Contact[]>("/contact"),
  });
}

export function useContactsGetById(id: number) {
  return useQuery<Contact>({
    queryKey: ["contacts", id],
    queryFn: () => get<Contact>(`/contact/${id}`),
  });
}

export function useContactsGetByClient(id: number) {
  return useQuery<Contact[]>({
    queryKey: ["contacts", "client", id],
    queryFn: () => get<Contact[]>(`/contact/client/${id}`),
  });
}

export function useContactsCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: ContactCreateDto) => post<Contact>("/contact", dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useContactsUpdate(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: ContactUpdateDto }) =>
      put<Contact>(`/contact/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["contacts", id] });
    },
  });
}

export function useContactsDelete(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => del<void>(`/contact/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["contacts", id] });
    },
  });
}
