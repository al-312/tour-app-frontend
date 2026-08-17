import type { Tour } from "../types/tour";

export const TOURS_DATA: Tour[] = [
  {
    id: "1",
    title: "Tropical Paradise Getaway",
    location: "Bali, Indonesia",
    price: 1299,
    duration: "7 Days",
    rating: 4.9,
    image: "/bali.jpg",
    category: "Relaxation",
    description: "Immerse yourself in Balinese culture, relax on pristine beaches, and explore historic water temples in Ubud.",
  },
  {
    id: "2",
    title: "Alpine Chalet Expedition",
    location: "Swiss Alps, Switzerland",
    price: 2499,
    duration: "5 Days",
    rating: 4.8,
    image: "/swiss.jpg",
    category: "Adventure",
    description: "Experience the peak of luxury and adventure. Hike through spectacular trails and cozy up in a traditional chalet.",
  },
  {
    id: "3",
    title: "Neon Tokyo Lights & Heritage",
    location: "Tokyo, Japan",
    price: 1899,
    duration: "6 Days",
    rating: 4.9,
    image: "/tokyo.jpg",
    category: "Cultural",
    description: "Dive into the vibrant nightlife of Shinjuku, taste world-class street food, and discover ancient temples.",
  },
];
