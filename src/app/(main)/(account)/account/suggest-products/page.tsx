"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

const suggestProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  company: z.string(),
});

type SuggestProductFormValues = z.infer<typeof suggestProductSchema>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function SuggestProductsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SuggestProductFormValues>({
    resolver: zodResolver(suggestProductSchema),
    defaultValues: { productName: "", company: "" },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be 2 MB or less.");
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only image files are allowed (JPEG, PNG, GIF, WebP).");
      return;
    }
  };

  const onSubmit = (data: SuggestProductFormValues) => {
    toast.success("Request submitted successfully. We will review your suggestion.");
    form.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="container max-w-2xl py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Suggest Products</h1>
      <p className="text-sm font-medium text-muted-foreground mb-6">Suggestions</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="i.e Square Pharmaceuticals Ltd." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Product Image</FormLabel>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 py-10 px-4 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Plus className="size-10 text-muted-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground text-center">
                Add image (max 2 MB). Only image files allowed.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                className="sr-only"
                aria-label="Upload product image"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            If you want to suggest multiple products, please email{" "}
            <a
              href="mailto:info@arogga.com"
              className="text-primary hover:underline font-medium"
            >
              info@arogga.com
            </a>
            .
          </p>

          <div className="flex justify-end">
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Submit Request
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
