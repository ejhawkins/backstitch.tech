import { createHash } from "node:crypto";
import { posts } from "./legacy-posts.ts";

const dryRun = process.argv.includes("--dry-run");
const space = process.env.CONTENTFUL_SPACE_ID;
const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT || "master";
const fields = [
  { id: "title", name: "Title", type: "Symbol", required: true },
  {
    id: "slug",
    name: "Slug",
    type: "Symbol",
    required: true,
    validations: [{ unique: true }, { regexp: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } }],
  },
  { id: "date", name: "Date", type: "Date", required: true },
  { id: "category", name: "Category", type: "Symbol", required: false },
  { id: "body", name: "Body", type: "Text", required: true },
].map((field) => ({ ...field, localized: false }));

if (new Set(posts.map((p) => p.slug)).size !== posts.length)
  throw new Error("Duplicate legacy slugs");
if (dryRun) {
  console.log(
    JSON.stringify(
      { contentType: "post", fields, count: posts.length, slugs: posts.map((p) => p.slug) },
      null,
      2,
    ),
  );
} else {
  if (!space || !token) throw new Error("Set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN");
  const base = `https://api.contentful.com/spaces/${encodeURIComponent(space)}/environments/${encodeURIComponent(environment)}`;
  async function request(
    path: string,
    method = "GET",
    body?: unknown,
    headers: Record<string, string> = {},
  ): Promise<any> {
    for (let attempt = 0; attempt < 6; attempt++) {
      const response = await fetch(base + path, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (response.status === 429) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            Math.max(1, Number(response.headers.get("X-Contentful-RateLimit-Reset")) || 1) * 1000,
          ),
        );
        continue;
      }
      if (response.status === 404 && method === "GET") return null;
      if (!response.ok) throw new Error(`Contentful ${method} ${path}: HTTP ${response.status}`);
      return response.json();
    }
    throw new Error("Contentful rate limit retries exhausted");
  }
  const locales = await request("/locales");
  const locale = locales.items.find((item: { default: boolean }) => item.default)?.code;
  if (!locale) throw new Error("No default Contentful locale");
  let model = await request("/content_types/post");
  if (!model) {
    model = await request("/content_types/post", "PUT", {
      name: "Post",
      displayField: "title",
      fields,
    });
    await request("/content_types/post/published", "PUT", undefined, {
      "X-Contentful-Version": String(model.sys.version),
    });
  } else {
    for (const expected of fields) {
      const actual = model.fields.find((field: { id: string }) => field.id === expected.id);
      if (
        !actual ||
        actual.type !== expected.type ||
        actual.localized ||
        actual.required !== expected.required ||
        (expected.id === "slug" && !actual.validations?.some((v: { unique?: boolean }) => v.unique))
      ) {
        throw new Error(
          `Existing post model incompatible at ${expected.id}; fix it before importing`,
        );
      }
    }
    if (!model.sys.publishedVersion)
      throw new Error("Publish the existing post model before importing");
  }
  for (const post of posts) {
    const id = `legacy-${createHash("sha256").update(post.slug).digest("hex").slice(0, 40)}`;
    const existing = await request(`/entries/${id}`);
    if (existing) {
      // Never overwrite editorial changes on a rerun. Finish publication after an interrupted create.
      if (
        existing.fields.slug?.[locale] !== post.slug ||
        existing.sys.contentType.sys.id !== "post"
      )
        throw new Error(`Entry ID conflict: ${post.slug}`);
      if (!existing.sys.publishedVersion)
        await request(`/entries/${id}/published`, "PUT", undefined, {
          "X-Contentful-Version": String(existing.sys.version),
        });
      console.log(`Skipped existing: ${post.slug}`);
      continue;
    }
    const duplicates = await request(
      `/entries?content_type=post&fields.slug=${encodeURIComponent(post.slug)}&limit=1`,
    );
    if (duplicates.total) throw new Error(`Slug already exists under another ID: ${post.slug}`);
    const values = {
      title: post.title,
      slug: post.slug,
      date: post.date,
      ...(post.category ? { category: post.category } : {}),
      body: post.body.join("\n\n"),
    };
    const localized = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, { [locale]: value }]),
    );
    const entry = await request(
      `/entries/${id}`,
      "PUT",
      { fields: localized },
      { "X-Contentful-Content-Type": "post" },
    );
    await request(`/entries/${id}/published`, "PUT", undefined, {
      "X-Contentful-Version": String(entry.sys.version),
    });
    console.log(`Published: ${post.slug}`);
  }
  console.log(`Migration complete: ${posts.length} posts`);
}
