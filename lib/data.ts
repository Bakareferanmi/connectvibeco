import type { EventListing, TripListing } from "@/lib/types";

export const EVENTS: EventListing[] = [
  { id: "01", title: "Rooftop Sessions: Sunset Sounds", category: "Music", date: "Sat, Aug 8", time: "7:00 PM", location: "Shoreditch, London", spots: 12, price: "£15", accent: "magenta", description: "A golden-hour set on a Shoreditch rooftop, mixing house and disco as the sun goes down over the city." },
  { id: "02", title: "Peak District Weekend Hike", category: "Trip", date: "Fri, Aug 14", time: "2 days", location: "Peak District", spots: 4, price: "£85", accent: "teal", description: "Two days on the ridgelines of the Peak District with a small group, a bunkhouse to crash in, and views worth the climb." },
  { id: "03", title: "Supper Club: Strangers & Stories", category: "Social", date: "Thu, Aug 6", time: "8:00 PM", location: "Hackney, London", spots: 3, price: "£28", accent: "violet", description: "A long table dinner in Hackney where nobody sits with people they came with. Good food, better conversation." },
  { id: "04", title: "Sunrise Yoga in the Park", category: "Wellness", date: "Sun, Aug 9", time: "7:00 AM", location: "Victoria Park, London", spots: 9, price: "£8", accent: "teal", description: "Start the day with a gentle flow in Victoria Park before the crowds arrive. All levels welcome, mats provided." },
  { id: "05", title: "Underground Jazz Night", category: "Music", date: "Fri, Aug 21", time: "9:00 PM", location: "Camden, London", spots: 6, price: "£20", accent: "magenta", description: "A low-lit Camden basement, a live jazz trio, and a crowd that actually listens." },
  { id: "06", title: "Coastal Cycling Day Trip", category: "Trip", date: "Sat, Aug 22", time: "1 day", location: "Brighton", spots: 7, price: "£45", accent: "teal", description: "A ride along the Brighton coastline with a lunch stop by the sea. Bikes and helmets sorted, you just show up." },
  { id: "07", title: "Board Games and Pizza", category: "Social", date: "Wed, Aug 12", time: "6:30 PM", location: "Peckham, London", spots: 10, price: "£10", accent: "violet", description: "Pull up a chair in Peckham for pizza, card games, and strangers who might become friends." },
  { id: "08", title: "Pottery for Beginners", category: "Wellness", date: "Sun, Aug 16", time: "2:00 PM", location: "Bethnal Green, London", spots: 5, price: "£32", accent: "violet", description: "Get your hands dirty in a relaxed Bethnal Green studio. No experience needed, just curiosity." },
];

export const CATEGORIES = ["All", "Music", "Trip", "Social", "Wellness"] as const;

export const TRIPS: TripListing[] = [
  {
    id: "t01",
    title: "Peak District Weekend Hike",
    location: "Peak District, England",
    dates: "Aug 14 to Aug 16",
    duration: "2 days",
    price: "£85",
    spots: 4,
    highlights: [
      "Guided ridge walk with a certified hiking leader",
      "Two nights in a shared bunkhouse",
      "All meals and transport from London included",
    ],
    accent: "teal",
    description: "Two days on the ridgelines of the Peak District, a shared bunkhouse to crash in each night, and a small group of strangers who'll feel like mates by the end.",
  },
  {
    id: "t02",
    title: "Coastal Cycling Day Trip",
    location: "Brighton, England",
    dates: "Aug 22",
    duration: "1 day",
    price: "£45",
    spots: 7,
    highlights: [
      "Bike hire and helmet included",
      "Coastal route with a lunch stop in Brighton",
      "Return coach from central London",
    ],
    accent: "magenta",
    description: "A relaxed ride along the Brighton coast with a proper lunch stop, then straight back to central London by coach.",
  },
  {
    id: "t03",
    title: "Lake District Wild Camp",
    location: "Lake District, England",
    dates: "Sep 5 to Sep 7",
    duration: "3 days",
    price: "£120",
    spots: 5,
    highlights: [
      "Wild camping with tents and kit provided",
      "Evening around the fire with the group",
      "Small group, capped at 12 people",
    ],
    accent: "violet",
    description: "Three days under canvas in the Lake District, fires in the evening, and a group capped small enough that everyone actually gets to know each other.",
  },
];
