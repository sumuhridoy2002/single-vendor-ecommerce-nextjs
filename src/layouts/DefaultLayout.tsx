import { AppSidebar } from "@/components/app-sidebar"
import { SiteFooter } from "@/components/global/SiteFooter"

interface DefaultLayoutProps {
  children: React.ReactNode
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <div className="w-0 shrink-0 overflow-hidden md:w-(--sidebar-width) md:overflow-visible md:self-stretch">
        <AppSidebar />
      </div>
      <main className="flex min-w-0 flex-1 flex-col pt-3 xs:pt-6 md:pt-8">
        {children}
        <SiteFooter />
      </main>
    </>
  )
}

export default DefaultLayout
