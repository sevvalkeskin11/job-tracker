import { api } from "./api";
import type { Application, ApplicationInput, ApplicationStatus, PaginatedApplications } from "../types/application";

export async function fetchApplications(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedApplications> {
  const { data } = await api.get<PaginatedApplications>("/applications", {
    params: { page, limit },
  });
  return data;
}

export async function createApplication(input: ApplicationInput): Promise<Application> {
  const { data } = await api.post<Application>("/applications", input);
  return data;
}

export async function updateApplication(
  id: string,
  input: Partial<ApplicationInput> & { status?: ApplicationStatus }
): Promise<Application> {
  const { data } = await api.patch<Application>(`/applications/${id}`, input);
  return data;
}

export async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/applications/${id}`);
}
