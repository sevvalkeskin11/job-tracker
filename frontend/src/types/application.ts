export type ApplicationStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export interface Application {
  id: string;
  userId: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string | null;
  createdAt: string;
}

export interface ApplicationInput {
  company: string;
  position: string;
  appliedDate: string;
  notes?: string;
}
