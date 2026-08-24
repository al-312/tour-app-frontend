export interface Destination {
  id: string;
  name: string;
  country: string;
  description?: string | undefined;
  coverImage?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDestinationRequest {
  name: string;
  country: string;
  description?: string | undefined;
  coverImage?: string | undefined;
}

export interface UpdateDestinationRequest {
  name?: string | undefined;
  country?: string | undefined;
  description?: string | undefined;
  coverImage?: string | undefined;
}
