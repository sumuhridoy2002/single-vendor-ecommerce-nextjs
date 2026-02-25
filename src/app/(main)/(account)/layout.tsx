import { AccountBreadcrumb } from "@/components/account/AccountBreadcrumb";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container w-full min-h-0 flex-1 max-w-7xl mx-auto pb-5">
      <AccountBreadcrumb />

      <div className="flex flex-1 min-h-0 mt-5 border border-border rounded-xl">
        <div className="hidden md:block">
          <AccountSidebar />
        </div>
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
