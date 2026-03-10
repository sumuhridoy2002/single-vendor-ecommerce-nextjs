import type { Metadata } from "next";
import { BlogsListClient } from "./BlogsListClient";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read our latest articles on skincare, beauty tips, and product guides.",
};

export default function BlogsPage() {
  return <BlogsListClient />;
}
