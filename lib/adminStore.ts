export type SocialKey = "instagram" | "x" | "tiktok" | "facebook" | "pinterest" | "threads";

export interface SocialLink {
  key: SocialKey;
  label: string;
  href: string;
  enabled: boolean;
}
