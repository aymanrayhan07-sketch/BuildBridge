import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BuildBridge — Unified AI Planner & Builder Workspace',
  description:
    'A unified AI workspace connecting Planner AI and Builder Agent workflows with persistent shared Project Memory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5efe6] text-[#28221c] antialiased min-h-screen font-sans selection:bg-[#7d4732]/20 selection:text-[#7d4732]">
        {children}
      </body>
    </html>
  );
}
