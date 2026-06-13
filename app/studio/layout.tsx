import { StudioBackdrop } from "@/components/glass";
import { SidebarNav, SidebarNavMobile } from "@/components/ds/sidebar-nav";
import { CommandMenu } from "@/components/ds/command-menu";

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen">
      <StudioBackdrop />
      <CommandMenu />
      <SidebarNav />
      <div className="pt-3 md:hidden">
        <SidebarNavMobile />
      </div>
      <main className="min-h-screen px-4 py-6 md:ml-[220px] md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
