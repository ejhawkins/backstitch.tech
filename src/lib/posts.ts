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

const PARAGRAPHS = [
  "There is a particular kind of clarity that only shows up when you give a single idea the whole page. No sidebar competing for attention, no related-posts carousel tugging at your sleeve — just the thought, laid out end to end, and room to finish it.",
  "I keep coming back to the idea that constraints are a kindness. When the page can only do one thing, the writing has to carry everything, and that pressure turns out to be exactly what the writing needed.",
  "None of this is a system. It is closer to a habit: show up, write the thing down, publish it before the doubt gets organized. The archive at the bottom of this page is the real artifact — the posts are just its annual rings.",
  "The walk took longer than expected, as walks tend to do when the weather is good. Somewhere between the second and third hour the thinking loosened, and the sentence I had been chasing all week finally stopped running.",
  "People ask how often I publish and the honest answer is: when something is ready. Frequency is a metric for machines. The only schedule that matters is the one between an idea arriving and me sitting down to meet it.",
];

function makePost(title: string, date: string, category?: string): Post {
  const slug = slugify(title);
  const seed = slug.length + date.length;
  const count = 2 + (seed % 3);
  const body = Array.from(
    { length: count },
    (_, i) => PARAGRAPHS[(seed + i) % PARAGRAPHS.length]!,
  );
  return { slug, title, date, category, body };
}

// ~60 posts, 2024–2026, newest first.
const raw: Array<[string, string, string?]> = [
  // 2026
  ["Beginning at the end", "2026-10-03", "From the atelier"],
  ["What a seam allowance teaches you about scope", "2026-09-28"],
  ["Brands don't make decisions, people do", "2026-09-17"],
  ["The sample that was never meant to ship", "2026-09-09"],
  ["Drafting the block", "2026-09-06", "From the atelier"],
  ["Two fittings, one pattern", "2026-08-29", "From the atelier"],
  ["Small tools, 2026 edition", "2026-08-28"],
  ["On values, margins, and doing business", "2026-08-21"],
  ["28 down, 16 more to go", "2026-08-19", "From the atelier"],
  ["27 down, 17 more to go", "2026-08-17", "From the atelier"],
  ["On content, writing, and art", "2026-08-11"],
  ["The quiet web is still out there", "2026-07-24"],
  ["Notes on walking alone", "2026-07-12", "From the atelier"],
  ["Email is still the best protocol", "2026-06-30"],
  ["A summer of small tools", "2026-06-14"],
  ["What I learned from a broken kiln", "2026-05-27"],
  ["The two-hour rule", "2026-05-09"],
  ["Ridge lines and deadlines", "2026-04-22", "From the atelier"],
  ["In praise of the unfinished", "2026-04-03"],
  ["March was for maintenance", "2026-03-29"],
  ["The garden, year three", "2026-03-08"],
  ["Slow software for fast people", "2026-02-19"],
  ["A letter to my future self", "2026-02-02"],
  ["New year, same notebook", "2026-01-11"],
  // 2025
  ["The last hike of the year", "2025-12-20", "From the atelier"],
  ["On endings", "2025-12-07"],
  ["What the fog taught me", "2025-11-23", "From the atelier"],
  ["Digital gardens, revisited", "2025-11-08"],
  ["The case for boring technology", "2025-10-26"],
  ["Autumn inventory", "2025-10-05"],
  ["Three summits, one lesson", "2025-09-21", "From the atelier"],
  ["Reading less, remembering more", "2025-09-02"],
  ["The workshop gets a window", "2025-08-17"],
  ["Heat waves and slow days", "2025-08-01"],
  ["Halfway through the ridge list", "2025-07-19", "From the atelier"],
  ["On saying no", "2025-07-03"],
  ["The newsletter is dead, long live the newsletter", "2025-06-15"],
  ["Tools I actually use", "2025-06-01"],
  ["A rainy week in the valley", "2025-05-18"],
  ["Why I still hand-write drafts", "2025-05-04"],
  ["Spring cleaning for the mind", "2025-04-13"],
  ["The first summit of the season", "2025-04-02", "From the atelier"],
  ["Notes on attention", "2025-03-16"],
  ["February, briefly", "2025-02-28"],
  ["The long view", "2025-02-09"],
  ["Starting the year offline", "2025-01-12"],
  // 2024
  ["Winter walking", "2024-12-15", "From the atelier"],
  ["A year of small posts", "2024-12-01"],
  ["The craft of leaving things out", "2024-11-17"],
  ["On friendship and distance", "2024-11-02"],
  ["October light", "2024-10-19"],
  ["The ridge that started it all", "2024-10-06", "From the atelier"],
  ["Learning to rest", "2024-09-14"],
  ["Late summer notes", "2024-08-25"],
  ["The first 100 days of writing", "2024-08-03"],
  ["Why this site exists", "2024-07-12"],
];

export const posts: Post[] = raw.map((row) =>
  makePost(row[0], row[1], row[2]),
);

export const getPost = (slug: string) =>
  posts.find((post) => post.slug === slug);

export function ordinalDay(isoDate: string): string {
  const day = Number(isoDate.slice(8, 10));
  const mod100 = day % 100;
  const suffix =
    mod100 >= 11 && mod100 <= 13
      ? "th"
      : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] ??
        "th";
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
