import DefaultLayout from "@/layouts/DefaultLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
