# backstitch.tech

A fashion & ecommerce dev log. Web work for fashion and beauty founders,
documented while it is still in progress.

A backstitch is worked backwards — the needle goes forward, then back through
the last hole, and that doubling back is why the seam holds. It is the strongest
stitch you can make by hand, and the slowest.

## Structure

One post per page, and no pagination anywhere. The complete archive renders at
the bottom of every post: a flat list of month headings and dotted-leader rows,
newest first, identical on every page. That list is the real artifact — the
posts are its annual rings.

- `src/lib/posts.ts` — the post data and date helpers
- `src/components/archive.tsx` — the archive, used by both the home page and every post
- `src/routes/thoughts.$slug.tsx` — a single post
- `src/styles.css` — design tokens, self-hosted faces, archive styles

## Type

Self-hosted in `public/fonts`:

- **Paris** — display, via `font-display`. Carries `letter-spacing: -0.13em`,
  drawn for masthead sizes. Add `tracking-normal` whenever it has to set a full
  sentence, or the word spaces close up.
- **Greater Theory** — labels and small caps, via `font-greater-theory`
- **September Spirit** — handwritten marker, via `font-hand`
- Reading text is a neutral grotesque; Paris gives out in long prose.

## Development

```sh
npm install
npm run dev
```

`npm run build` to build, `npm test` for the route tests.
