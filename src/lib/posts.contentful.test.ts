import { describe, expect, it } from "vitest";
import { toPost, validatePosts } from "./posts.contentful";
import { posts as legacy } from "../../scripts/legacy-posts";

const fields = { title: "Test", slug: "test", date: "2026-10-03", body: "First\nline\n\nSecond" };
describe("Contentful post mapping", () => {
  it("preserves paragraphs and optional categories", () => {
    expect(toPost(fields).body).toEqual(["First\nline", "Second"]);
    expect(toPost({ ...fields, category: "Atelier" }).category).toBe("Atelier");
  });
  it("rejects invalid payloads and duplicate slugs", () => {
    expect(() => toPost({ ...fields, date: "broken" })).toThrow();
    expect(() => toPost({ ...fields, body: {} })).toThrow();
    expect(() => validatePosts([{ fields }, { fields }])).toThrow();
  });
  it("sorts newest first and round trips all 56 original posts", () => {
    const converted = validatePosts(
      [...legacy].reverse().map((p) => ({ fields: { ...p, body: p.body.join("\n\n") } })),
    );
    expect(converted).toHaveLength(56);
    expect(converted).toEqual(legacy);
  });
});
