import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { CmsPageDetail } from "@/types/cms-page";
import Image from "next/image";
import Link from "next/link";

export interface CmsPageContentProps {
  page: CmsPageDetail;
}

export function CmsPageContent({ page }: CmsPageContentProps) {
  return (
    <div className="container w-full max-w-4xl space-y-6 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate">{page.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className="space-y-6">
        <header className="space-y-4">
          {page.banner ? (
            <div className="relative aspect-3/1 w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={page.banner}
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
            {page.title}
          </h1>
          {page.image ? (
            <div className="relative h-24 w-48 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={page.image}
                alt=""
                fill
                className="object-contain"
                sizes="192px"
                unoptimized
              />
            </div>
          ) : null}
        </header>

        {page.description ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h1,&_h2,&_h3]:font-semibold [&_h1,&_h2,&_h3]:text-foreground [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: page.description }}
          />
        ) : null}
      </article>
    </div>
  );
}
