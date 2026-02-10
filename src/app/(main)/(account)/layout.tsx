import { AccountBreadcrumb } from "@/components/account/AccountBreadcrumb";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-0 flex-1 max-w-7xl mx-auto py-5">
      <AccountBreadcrumb />

      <div className="flex flex-1 min-h-0 mt-5 border border-border rounded-xl">
        <AccountSidebar />
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
