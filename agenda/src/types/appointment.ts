export type AppointmentStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

export interface Appointment {
  id: string;

  clientId: string;
  clientName: string;
  clientPhone?: string;

  condominium: string;
  houseNumber: string;

  date: string;
  startTime: string;

  service: string;
  notes?: string;

  status: AppointmentStatus;

  createdAt: Date;
  updatedAt: Date;
}