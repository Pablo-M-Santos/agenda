export interface Client {
  id: string;

  ownerId: string;

  name: string;
  phone: string;

  condominium: string;
  houseNumber: string;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}