"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NewsletterSubscribe } from "@/components/newsletter/NewsletterSubscribe";
import { postBlogComment } from "@/lib/api/blogs";
import type { BlogDetail, BlogListItem } from "@/types/blog";
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn";
import { Eye, Loader2, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export interface BlogPostContentProps {
  blog: BlogDetail;
  relatedBlogs: BlogListItem[];
}

export function BlogPostContent({ blog, relatedBlogs }: BlogPostContentProps) {
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [pendingComments, setPendingComments] = useState<
    { user_name: string; comment: string; created_at: string }[]
  >([]);
  const whenLoggedIn = useWhenLoggedIn();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) {
      toast.error("Please enter a comment");
      return;
    }
    whenLoggedIn(() => {
      setCommentLoading(true);
      postBlogComment(blog.id, { comment: trimmed })
        .then((res) => {
          toast.success(res.message ?? "Comment submitted and waiting for approval.");
          setPendingComments((prev) => [
            ...prev,
            {
              user_name: res.data.user_name,
              comment: res.data.comment,
              created_at: res.data.created_at,
            },
          ]);
          setComment("");
        })
        .catch((err) => {
          toast.error(err instanceof Error ? err.message : "Failed to submit comment");
        })
        .finally(() => setCommentLoading(false));
    });
  };

  const allComments = [...(blog.comments ?? []), ...pendingComments];

  return (
    <div className="container w-full max-w-4xl space-y-8 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/blogs">Blogs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate">{blog.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className="space-y-6">
        <header className="space-y-4">
          {blog.banner ? (
            <div className="relative aspect-3/1 w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={blog.banner}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                unoptimized
              />
            </div>
          ) : null}
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{blog.published_at}</span>
            {blog.view_count != null && blog.view_count !== "" && (
              <span className="flex items-center gap-1">
                <Eye className="size-4" aria-hidden />
                {blog.view_count}
              </span>
            )}
          </div>
        </header>

        {blog.long_description ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h1,&_h2,&_h3]:font-semibold [&_h1,&_h2,&_h3]:text-foreground [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: blog.long_description }}
          />
        ) : null}

        {blog.gallery_images && blog.gallery_images.length > 0 ? (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              Gallery
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {blog.gallery_images.map((src, i) => (
                <li key={i}>
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      unoptimized
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <MessageSquare className="size-5" aria-hidden />
          Comments
        </h2>
        {allComments.length > 0 ? (
          <ul className="space-y-3">
            {allComments.map((c, idx) => (
              <li
                key={`comment-${idx}`}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="font-medium text-foreground">{c.user_name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.comment}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.created_at}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
        <form onSubmit={handleCommentSubmit} className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="border-input bg-transparent placeholder:text-muted-foreground w-full min-w-0 rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            disabled={commentLoading}
            onFocus={() => whenLoggedIn(() => {})}
          />
          <Button type="submit" disabled={commentLoading || !comment.trim()}>
            {commentLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "Post comment"
            )}
          </Button>
        </form>
      </section>

      {relatedBlogs.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Related articles
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {relatedBlogs.map((item) => (
              <li key={item.id}>
                <Card className="overflow-hidden">
                  <Link
                    href={`/blogs/${encodeURIComponent(item.slug)}`}
                    className="block"
                  >
                    {item.banner ? (
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                        <Image
                          src={item.banner}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                          unoptimized
                        />
                      </div>
                    ) : null}
                  </Link>
                  <CardHeader className="pb-1">
                    <Link
                      href={`/blogs/${encodeURIComponent(item.slug)}`}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {item.title}
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {item.short_description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-lg border border-border bg-muted/30 p-4 md:p-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Subscribe to our newsletter
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Get the latest tips and offers delivered to your inbox.
        </p>
        <NewsletterSubscribe />
      </section>
    </div>
  );
}
