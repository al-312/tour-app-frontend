export interface PhoneObject {
  countryCode?: string | undefined;
  number?: string | undefined;
  phoneNumber?: string | undefined;
}

export interface Consultant {
  id: string;
  firstName: string;
  lastName?: string | undefined;
  name?: string | undefined;
  designation: string;
  phone?: PhoneObject | undefined;
  email?: string | undefined;
  temporaryPassword?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultantRequest {
  firstName: string;
  lastName?: string | undefined;
  designation: string;
  phone?: PhoneObject | undefined;
  email?: string | undefined;
}

export interface UpdateConsultantRequest {
  firstName?: string | undefined;
  lastName?: string | undefined;
  designation?: string | undefined;
  phone?: PhoneObject | undefined;
  email?: string | undefined;
}
