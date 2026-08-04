export type Accent = "magenta" | "teal" | "violet";

export interface EventListing {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  spots: number;
  price: string;
  accent: Accent;
  description: string;
}

export interface TripListing {
  id: string;
  title: string;
  location: string;
  dates: string;
  duration: string;
  price: string;
  spots: number;
  highlights: string[];
  accent: Accent;
  description: string;
}
