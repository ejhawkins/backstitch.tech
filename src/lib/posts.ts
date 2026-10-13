export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  category?: string | undefined;
  body: string[];
};

export const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Async compatibility exports: data is fetched through the server boundary.
import { getPosts, getPost as fetchPost } from "./posts.functions";
export const posts = getPosts;
export const getPost = (slug: string) => fetchPost({ data: { slug } });

export function ordinalDay(isoDate: string): string {
  const day = Number(isoDate.slice(8, 10));
  const mod100 = day % 100;
  const suffix =
    mod100 >= 11 && mod100 <= 13
      ? "th"
      : (({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] ?? "th");
  return `${day}${suffix}`;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function monthName(isoDate: string): string {
  return MONTH_NAMES[Number(isoDate.slice(5, 7)) - 1]!;
}

export function yearOf(isoDate: string): string {
  return isoDate.slice(0, 4);
}
