import { createFileRoute, notFound, Link } from "@tanstack/react-router";

import { getPost, monthName, ordinalDay, yearOf } from "@/lib/posts";
import { Archive } from "@/components/archive";

export const Route = createFileRoute("/thoughts/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — Backstitch` : "Backstitch" },
      {
        name: "description",
        content: loaderData?.body[0] ?? "A post from Backstitch.",
      },
      {
        property: "og:title",
        content: loaderData ? `${loaderData.title} — Backstitch` : "Backstitch",
      },
      {
        property: "og:description",
        content: loaderData?.body[0] ?? "A post from Backstitch.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[610px] px-6 py-20 sm:py-28">
        <main>
          <p className="font-label text-[11px] tracking-label text-muted-foreground">
            <Link
              to="/"
              className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
            >
              Backstitch
            </Link>
          </p>
          <h1 className="mt-6 font-display text-4xl leading-tight tracking-normal text-foreground">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>
              {monthName(post.date)} {ordinalDay(post.date)}, {yearOf(post.date)}
            </time>
            {post.category && (
              <span className="ml-3 rounded-sm bg-secondary px-2 py-0.5 text-[0.65rem] font-medium tracking-widest uppercase">
                {post.category}
              </span>
            )}
          </p>
          <div className="mt-10 space-y-7">
            {post.body.map((paragraph, i) => (
              <p key={i} className="text-foreground/90">
                {paragraph}
              </p>
            ))}
          </div>
        </main>

        <aside className="mt-16 rounded-md border border-border bg-secondary/50 p-6">
          <h2 className="font-label text-[11px] tracking-label text-muted-foreground">
            What next
          </h2>
          <p className="mt-3 text-sm text-foreground/90">
            New posts go out by email and RSS whenever they're ready — no
            schedule, no noise. Or just write to me; email works fine.
          </p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <a
              href="#"
              className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
            >
              RSS
            </a>
            <a
              href="#"
              className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
            >
              Newsletter
            </a>
            <a
              href="mailto:ericajhawkins@gmail.com"
              className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
            >
              Email
            </a>
          </div>
        </aside>

        <div className="mt-20">
          <h2 className="font-label text-[11px] tracking-label text-muted-foreground">
            The full archive
          </h2>
          <Archive currentSlug={post.slug} />
        </div>

        <footer className="mt-20 flex flex-wrap gap-6 border-t border-border pt-8 pb-6 text-sm text-muted-foreground">
          <Link
            to="/"
            className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
          >
            Home
          </Link>
          <a
            href="#"
            className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
          >
            RSS
          </a>
          <a
            href="mailto:ericajhawkins@gmail.com"
            className="text-link underline decoration-link/40 underline-offset-4 transition-colors hover:decoration-link"
          >
            Email
          </a>
          <span className="ml-auto">No tracking, no feeds, no ads.</span>
        </footer>
      </div>
    </div>
  );
}
