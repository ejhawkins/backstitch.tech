import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { validatePosts } from "./posts.contentful";

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  const space = process.env["CONTENTFUL_SPACE_ID"];
  // Preview is an explicit server deployment setting, never a public input.
  const preview = process.env["CONTENTFUL_PREVIEW"] === "true";
  const accessToken = preview
    ? process.env["CONTENTFUL_PREVIEW_TOKEN"]
    : process.env["CONTENTFUL_ACCESS_TOKEN"];
  if (!space || !accessToken) throw new Error("Contentful server credentials are not configured");
  const { createClient } = await import("contentful");
  const client = createClient({
    space,
    accessToken,
    environment: process.env["CONTENTFUL_ENVIRONMENT"] || "master",
    host: preview ? "preview.contentful.com" : "cdn.contentful.com",
  });
  const entries: Array<{ fields: unknown }> = [];
  // API batches are fully drained before returning; the UI always gets the full archive.
  let total = Infinity;
  while (entries.length < total) {
    const page = await client.getEntries({
      content_type: "post",
      order: ["-fields.date", "sys.id"],
      limit: 1000,
      skip: entries.length,
    });
    total = page.total;
    if (!page.items.length && entries.length < total)
      throw new Error("Incomplete Contentful archive response");
    entries.push(...page.items);
  }
  return validatePosts(entries);
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }))
  .handler(async ({ data }) => (await getPosts()).find((post) => post.slug === data.slug));
