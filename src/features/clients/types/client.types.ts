export interface Client {
  id: string;
  name: string;
  phone?: string | undefined;
  email?: string | undefined;
  nationality?: string | undefined;
  notes?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  name: string;
  phone?: string | undefined;
  email?: string | undefined;
  nationality?: string | undefined;
  notes?: string | undefined;
}

export interface UpdateClientRequest {
  name?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  nationality?: string | undefined;
  notes?: string | undefined;
}
