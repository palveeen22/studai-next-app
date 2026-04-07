import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/shared/store/provider';
import { QueryProvider } from '@/shared/query/provider';

export const metadata: Metadata = {
  title: 'StudAI — AI-Powered Study Assistant',
  description:
    'Manage tasks, generate AI summaries & quizzes, chat with an AI tutor, and track your study streaks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <StoreProvider>
          <QueryProvider>{children}</QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
