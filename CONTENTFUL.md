# Contentful setup

Use Node 22.18+ (or Node 24) and npm. Copy `.env.example` to `.env` and fill in server credentials. Set the same variables on your hosting platform; never prefix them with `VITE_`.

The content type ID is **post**. Its exact field IDs are:

| ID       | Contentful type     | Required | Validation                           |
| -------- | ------------------- | -------- | ------------------------------------ |
| title    | Short text (Symbol) | Yes      |                                      |
| slug     | Short text (Symbol) | Yes      | Unique, `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| date     | Date                | Yes      |                                      |
| category | Short text (Symbol) | No       |                                      |
| body     | Long text (Text)    | Yes      |                                      |

Use nonlocalized fields and the environment's default locale. Separate body paragraphs with a blank line. Rich text is intentionally unsupported: the existing renderer consumes plain paragraphs. Publish the model and entries to make them visible on the production site.

## Import the existing archive once

1. Create a Contentful space and a personal Content Management API token with write access. Set `CONTENTFUL_SPACE_ID`, `CONTENTFUL_MANAGEMENT_TOKEN`, and optionally `CONTENTFUL_ENVIRONMENT` (defaults to `master`) in `.env`.
2. Run `npm run:contentful -- --dry-run` to inspect the model and 56 source slugs without any API calls.
3. Run `npm run migrate:contentful`. This creates and publishes the model if absent, then creates and publishes all 56 entries. An incompatible existing model stops the script. The three separate home-page samples are not imported.
4. Configure `CONTENTFUL_ACCESS_TOKEN` with the space's Content Delivery API token, then run `npm run dev -- --port 8080`.

The snapshot in `scripts/legacy-posts.ts` preserves the original generated bodies, dates, categories and slugs. Stable entry IDs make reruns safe: existing entries are skipped, never overwritten; an entry created but not published during an interrupted run is published on rerun. Slug collisions under other IDs stop the import. The script respects management API rate-limit retries. Remove the management token from the runtime deployment; only the migration needs it.

`CONTENTFUL_PREVIEW_TOKEN` is the separate Content Preview API token. Production ignores it. Set `CONTENTFUL_PREVIEW=true` only on a private preview deployment to read drafts; the public visitor cannot request preview mode.

## Data boundary and call-site changes

`Post`, `slugify`, `ordinalDay`, `monthName`, `yearOf` and `MONTH_NAMES` remain client-safe. `posts()` now returns `Promise<Post[]>`, and `getPost(slug)` returns `Promise<Post | undefined>`; a mutable module-level array would leak data between server requests and cannot support fresh CMS content safely.

Both route loaders await the server function. The home route supplies loader posts to `Archive`; the post route fetches once, finds the requested slug (404 if absent), and passes the same complete array to `Archive`. Head metadata still uses the selected post. `Archive` now requires a `posts` prop. Its row elements and classes are unchanged. The home page now renders Contentful posts instead of the three hardcoded sample entries. Its About navigation link has been removed.

The server function reads credentials inside its handler and uses the Contentful SDK only server-side. API batches are combined before returning, including archives larger than the API's 1,000-entry response limit. This does not paginate the UI: every page renders every archive row in the initial HTML. Invalid fields, duplicate slugs and API failures fail visibly instead of silently dropping posts or serving the legacy snapshot.

See [Contentful delivery query parameters](https://www.contentful.com/developers/docs/references/content-delivery-api/search-parameters/) and [management API entries](https://www.contentful.com/developers/docs/references/content-management-api/entries/).

## Verification in this checkout

Build, TypeScript checking and all four unit tests passed. With a temporary external mock at the Contentful SDK HTTP boundary, curl returned 56 archive rows on both home and post pages; the post page had exactly one `aria-current="page"`. Browser checks at 390px after fonts loaded found no clipped archive titles on either page. Port 8081 was used because another checkout already occupied 8080. Live Contentful delivery and import still require your credentials.

At your subsequent request, `p` elements use `font-size: 40px; line-height: normal`. Archive titles are explicitly exempt and inherit the archive's responsive size, as you approved; this also resolves four titles that clipped on unchanged main. Archive markup and self-hosted fonts are preserved.

## Current content

After the initial migration, the 56 imported sample posts were removed at the owner's request. Only the October 13, 2026 post remains in Contentful. Running the migration again will recreate the original 56 posts; do not rerun it unless restoring those posts is intended. The original snapshot remains available for recovery.

## Vercel

Import this repository with the TanStack Start preset, install with `npm ci`, and build with `npm run build`. Set `NITRO_PRESET=vercel`, `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, and `CONTENTFUL_ENVIRONMENT=master`. Keep the management token local.
