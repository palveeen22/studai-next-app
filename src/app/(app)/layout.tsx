import { Sidebar } from '@/widgets/sidebar';
import { MobileTabbar } from '@/widgets/tabbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <div className="lg:pl-64">
        {/* <Topbar /> */}
        <main className="min-h-[calc(100vh-3.5rem)] pb-16 lg:pb-0 lg:min-h-screen">
          {children}
        </main>
      </div>
      <MobileTabbar />
    </div>
  );
}
