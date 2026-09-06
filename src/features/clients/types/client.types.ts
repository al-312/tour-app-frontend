export interface Client {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string | undefined;
  email?: string | undefined;
  country?: string | undefined;
  nationality?: string | undefined;
  address?: string | undefined;
  passportNumber?: string | undefined;
  notes?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  name: string;
  phone?: string | undefined;
  email?: string | undefined;
  country?: string | undefined;
  nationality?: string | undefined;
  address?: string | undefined;
  passportNumber?: string | undefined;
  notes?: string | undefined;
}

export interface UpdateClientRequest {
  name?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  country?: string | undefined;
  nationality?: string | undefined;
  address?: string | undefined;
  passportNumber?: string | undefined;
  notes?: string | undefined;
}
