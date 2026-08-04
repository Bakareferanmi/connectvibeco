import type { EventListing } from "@/lib/types";

export const EVENTS: EventListing[] = [
  { id: "01", title: "Rooftop Sessions: Sunset Sounds", category: "Music", date: "Sat, Aug 8", time: "7:00 PM", location: "Shoreditch, London", spots: 12, price: "£15", accent: "magenta" },
  { id: "02", title: "Peak District Weekend Hike", category: "Trip", date: "Fri, Aug 14", time: "2 days", location: "Peak District", spots: 4, price: "£85", accent: "teal" },
  { id: "03", title: "Supper Club: Strangers & Stories", category: "Social", date: "Thu, Aug 6", time: "8:00 PM", location: "Hackney, London", spots: 3, price: "£28", accent: "violet" },
  { id: "04", title: "Sunrise Yoga in the Park", category: "Wellness", date: "Sun, Aug 9", time: "7:00 AM", location: "Victoria Park, London", spots: 9, price: "£8", accent: "teal" },
  { id: "05", title: "Underground Jazz Night", category: "Music", date: "Fri, Aug 21", time: "9:00 PM", location: "Camden, London", spots: 6, price: "£20", accent: "magenta" },
  { id: "06", title: "Coastal Cycling Day Trip", category: "Trip", date: "Sat, Aug 22", time: "1 day", location: "Brighton", spots: 7, price: "£45", accent: "teal" },
  { id: "07", title: "Board Games and Pizza", category: "Social", date: "Wed, Aug 12", time: "6:30 PM", location: "Peckham, London", spots: 10, price: "£10", accent: "violet" },
  { id: "08", title: "Pottery for Beginners", category: "Wellness", date: "Sun, Aug 16", time: "2:00 PM", location: "Bethnal Green, London", spots: 5, price: "£32", accent: "violet" },
];

export const CATEGORIES = ["All", "Music", "Trip", "Social", "Wellness"] as const;
	

