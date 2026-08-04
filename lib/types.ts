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
}
