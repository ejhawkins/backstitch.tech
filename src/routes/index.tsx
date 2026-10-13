import { createFileRoute } from "@tanstack/react-router";

import { Archive } from "@/components/archive";
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
      "A backstitch is worked backwards. You push the needle forward, then come back through the last hole, and that doubling back is the whole reason the seam holds. It is the strongest stitch you can make by hand, and it is slower than every alternative.",
      "That is roughly how this site works. The writing goes up while the work is still in progress — not afterwards, once it has been tidied into a case study and the decisions have been sanded off.",
    ],
  },
  {
    date: "September 2026",
    title: "The desk by the window",
    body: [
      "I moved my desk back against the window last week and it changed the rhythm of the whole morning. There is something about working in natural light that no lamp has managed to replicate.",
      "The notebook stays open now. That was the trick in the end — not discipline, not routine, just removing the small friction of a closed cover.",
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
      "This site has no analytics, no newsletter popup, no comments. It is a stack of pages, read the way you would flip through a book — top to bottom, at whatever pace suits you.",
      "If you want to say hello, email works fine. It always has.",
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
        <h2 className="font-display text-3xl tracking-normal text-foreground">
          {entry.title}
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
      <div className="mx-auto w-full max-w-[42rem] px-6 py-24 sm:py-32">
        <header className="space-y-6 pb-24">
          {/* One word, so the display face's -0.13em is an asset here rather
              than the legibility problem it becomes on a sentence. */}
          <h1 className="font-display text-5xl leading-none text-foreground">
            Backstitch
          </h1>
          <p className="max-w-[36rem] text-foreground/90">
            Web work for fashion and beauty founders, documented as it happens —
            the decisions, the parts that did not work, and what changed as a
            result. One column, no noise.
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
            Backstitch is written and built by Erica Hawkins in Atlanta. No
            tracking, no feeds, no ads.
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
