export interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  category: "Adventure" | "Relaxation" | "Cultural" | "Nature";
  description: string;
  status?: string;
}
