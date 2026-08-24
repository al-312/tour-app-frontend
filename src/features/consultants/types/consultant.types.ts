export interface Consultant {
  id: string;
  name: string;
  designation: string;
  phone?: string | undefined;
  email?: string | undefined;
  logo?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultantRequest {
  name: string;
  designation: string;
  phone?: string | undefined;
  email?: string | undefined;
  logo?: string | undefined;
}

export interface UpdateConsultantRequest {
  name?: string | undefined;
  designation?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  logo?: string | undefined;
}
