import { z } from "zod";
import type { Post } from "./posts";

// Plain, credential-free conversion shared with tests and the migration.
const postFields = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z
    .string()
    .refine(
      (value) => /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) && Number.isFinite(Date.parse(value)),
      "Invalid post date",
    ),
  category: z.string().optional(),
  body: z.string().min(1),
});

export function toPost(fields: unknown): Post {
  const parsed = postFields.parse(fields);
  return {
    ...parsed,
    body: parsed.body
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };
}

export function validatePosts(entries: Array<{ fields: unknown }>): Post[] {
  const posts = entries.map((entry) => toPost(entry.fields));
  if (new Set(posts.map((post) => post.slug)).size !== posts.length) {
    throw new Error("Contentful posts contain duplicate slugs");
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
