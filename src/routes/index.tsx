import { createFileRoute } from "@tanstack/react-router";

import { Archive } from "@/components/archive";
import { PartItalic } from "@/components/part-italic";
import deskImg from "@/assets/desk.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Backstitch — a fashion & ecommerce dev log" },
      {
        name: "description",
        content:
          "Web work for fashion and beauty founders, documented as it happens. One column, no noise.",
      },
      { property: "og:title", content: "Backstitch — a fashion & ecommerce dev log" },
      {
        property: "og:description",
        content:
          "Web work for fashion and beauty founders, documented as it happens. One column, no noise.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Entry = {
  date: string;
  title: string;
  body: string[];
  image?: { src: string; alt: string; caption?: string };
};

const entries: Entry[] = [
  {
    date: "October 2026",
    title: "Beginning at the end",
    body: [
      "A backstitch is worked backwards. That doubling back is why the seam holds. It is the strongest stitch you can make by hand, and the slowest.",
    ],
  },
  {
    date: "September 2026",
    title: "The desk by the window",
    body: [
      "The notebook stays open now. That was the trick — not discipline, just removing the friction of a closed cover.",
    ],
    image: {
      src: deskImg,
      alt: "A wooden desk by a window with an open notebook and a cup of coffee",
      caption: "Morning light, doing most of the work",
    },
  },
  {
    date: "August 2026",
    title: "On slowing down",
    body: [
      "No analytics, no popup, no comments. A stack of pages, read top to bottom.",
    ],
  },
];

function EntryBlock({ entry }: { entry: Entry }) {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-label text-[11px] tracking-label text-muted-foreground">
          {entry.date}
        </p>
        <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] text-foreground">
          <PartItalic>{entry.title}</PartItalic>
        </h2>
      </header>

      {entry.body.map((paragraph, i) => (
        <p key={i} className="text-foreground/90">
          {paragraph}
        </p>
      ))}

      {entry.image && (
        <figure className="space-y-3 pt-2">
          <img
            src={entry.image.src}
            alt={entry.image.alt}
            loading="lazy"
            width={1408}
            height={1024}
            className="bw-img w-full border border-border"
          />
          {entry.image.caption && (
            <figcaption className="font-label text-[11px] tracking-label text-muted-foreground">
              {entry.image.caption}
            </figcaption>
          )}
        </figure>
      )}
    </article>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[64rem] px-6 py-24 sm:py-32">
        <header className="space-y-6 pb-24">
          {/* The wordmark is artwork now, so the text lives on for screen
              readers and search while the mask does the drawing. */}
          <h1>
            <span className="sr-only">Backstitch</span>
            <span aria-hidden="true" className="logo-mark" />
          </h1>
          <p className="max-w-[34ch] text-foreground/90">
            Web work for fashion founders, documented while it is still in
            progress.
          </p>
          <nav className="flex gap-6 font-label text-[11px] tracking-label">
            <a
              href="#entries"
              className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
            >
              Entries
            </a>
            <a
              href="#archive"
              className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
            >
              Archive
            </a>
            <a
              href="#about"
              className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
            >
              About
            </a>
          </nav>
        </header>

        <main id="entries" className="space-y-32">
          {entries.map((entry) => (
            <EntryBlock key={entry.title} entry={entry} />
          ))}
        </main>

        {/* The same component the post pages render, not a second copy of it.
            This page used to carry its own hardcoded month/day list, which could
            drift away from the real post data without anyone noticing. */}
        <div id="archive" className="mt-32">
          <h2 className="font-label text-[11px] tracking-label text-muted-foreground">
            Everything, newest first
          </h2>
          <Archive />
        </div>

        <footer
          id="about"
          className="mt-32 space-y-4 border-t border-border pt-12 pb-8"
        >
          <p className="text-sm text-muted-foreground">
            Erica Hawkins, Atlanta. No tracking, no feeds, no ads.
          </p>
          <p className="text-sm text-muted-foreground">
            Say hello:{" "}
            <a
              href="mailto:ericajhawkins@gmail.com"
              className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
            >
              ericajhawkins@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
