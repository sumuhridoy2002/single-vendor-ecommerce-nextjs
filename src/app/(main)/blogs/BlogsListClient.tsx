"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { fetchBlogs } from "@/lib/api/blogs";
import type { BlogListItem } from "@/types/blog";
import { Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function BlogCard({ blog }: { blog: BlogListItem }) {
  return (
    <Card className="overflow-hidden pb-5">
      <Link href={`/blogs/${encodeURIComponent(blog.slug)}`} className="block">
        {blog.banner ? (
          <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
            <Image
              src={blog.banner}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
        ) : null}
      </Link>
      <CardHeader className="pb-2">
        <Link href={`/blogs/${encodeURIComponent(blog.slug)}`}>
          <h2 className="line-clamp-2 text-lg font-semibold text-foreground hover:text-primary">
            {blog.title}
          </h2>
        </Link>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {blog.short_description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>{blog.published_at}</span>
        {blog.view_count != null && blog.view_count !== "" && (
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" aria-hidden />
            {blog.view_count}
          </span>
        )}
        <Link
          href={`/blogs/${encodeURIComponent(blog.slug)}`}
          className="ml-auto font-medium text-primary hover:underline"
        >
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
}

export function BlogsListClient() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    fetchBlogs(page)
      .then((res) => {
        if (!cancelled) {
          setBlogs(res.data);
          setMeta({
            current_page: res.meta.current_page,
            last_page: res.meta.last_page,
            total: res.meta.total,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load blogs"
          );
          setBlogs([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="container py-3 xs:py-6 md:py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Blogs</h1>

      {loading && blogs.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2
            className="size-8 animate-spin text-muted-foreground"
            aria-hidden
          />
        </div>
      ) : blogs.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No blogs yet.
        </p>
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <li key={blog.id}>
                <BlogCard blog={blog} />
              </li>
            ))}
          </ul>

          {meta && meta.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {meta.current_page} of {meta.last_page} ({meta.total}{" "}
                blogs)
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
