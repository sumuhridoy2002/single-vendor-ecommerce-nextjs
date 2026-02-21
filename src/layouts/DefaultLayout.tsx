import { AppSidebar } from "@/components/app-sidebar"

interface DefaultLayoutProps {
  children: React.ReactNode
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <div className="w-0 shrink-0 overflow-hidden md:w-(--sidebar-width) md:overflow-visible md:self-stretch">
        <AppSidebar />
      </div>
      <main className="flex min-w-0 flex-1 flex-col py-6 md:py-8">
        {children}
      </main>
    </>
  )
}

export default DefaultLayout
