import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { get, post, put, del } from "../../lib/api";
import type { Contact, ContactCreateDto, ContactUpdateDto } from "../../types";

export function useContactsGetAll() {
  return useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: () => get<Contact[]>("/contact"),
  });
}

export function useContactsGetByClient(id: number) {
  return useQuery<Contact[]>({
    queryKey: ["contacts", "client", id],
    queryFn: () => get<Contact[]>(`/contact/client/${id}`),
  });
}

export function useContactsCreate(clientId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: ContactCreateDto) => post<Contact>("/contact", dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["contacts", "client", clientId] });
      enqueueSnackbar("Contact created successfully", {
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

export function useContactsUpdate(clientId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; dto: ContactUpdateDto }) =>
      put<Contact>(`/contact/${vars.id}`, vars.dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["contacts", "client", clientId] });
      enqueueSnackbar("Contact updated successfully", {
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

export function useContactsDelete(clientId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => del<void>(`/contact/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["contacts", "client", clientId] });
      enqueueSnackbar("Contact deleted", {
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
