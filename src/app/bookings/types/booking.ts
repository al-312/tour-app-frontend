export interface Booking {
  id: string;
  excursion: string;
  client: string;
  date: string;
  amount: string;
  status: "confirmed" | "pending" | "cancelled";
}
