import { Fragment } from "react";

import { type Post, ordinalDay, monthName, yearOf } from "@/lib/posts";

/**
 * The full archive: a flat sequence of siblings — month heading, then its
 * posts, then the next month — newest first. No pagination, no filtering.
 * Identical on every post page.
 */
export function Archive({ posts, currentSlug }: { posts: Post[]; currentSlug?: string }) {
  let lastMonthKey: string | null = null;
  let lastYear: string | null = null;

  return (
    <nav aria-label="Archive" className="archive">
      {posts.map((post) => {
        const year = yearOf(post.date);
        const monthKey = post.date.slice(0, 7);
        const showHeading = monthKey !== lastMonthKey;
        const showYear = year !== lastYear;
        lastMonthKey = monthKey;
        lastYear = year;

        const isCurrent = post.slug === currentSlug;
        return (
          <Fragment key={post.slug}>
            {showHeading && (
              <h3 className="archive-month">
                <span className="year">{showYear ? year : null}</span>
                <span className="month">{monthName(post.date)}</span>
              </h3>
            )}
            <a
              className="archive-item"
              href={`/thoughts/${post.slug}`}
              aria-current={isCurrent ? "page" : undefined}
            >
              <p>{post.title}</p>
              <hr />
              <time dateTime={post.date}>{ordinalDay(post.date)}</time>
            </a>
          </Fragment>
        );
      })}
    </nav>
  );
}
