import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

interface DefaultLayoutProps {
  children: React.ReactNode
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <SidebarProvider>
      <div
        className="hidden shrink-0 md:block md:self-stretch"
        style={{ width: "var(--sidebar-width, 20rem)" }}
      >
        <AppSidebar />
      </div>
      <main className="flex min-w-0 flex-1 flex-col py-6 md:py-8">
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DefaultLayout
