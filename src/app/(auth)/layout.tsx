import { AuthHeader } from './AuthHeader';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#131f24] flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
