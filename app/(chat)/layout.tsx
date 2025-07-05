// app/layout.tsx
import { LoadingProvider } from "@/providers/loading";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`antialiased bg-pink-200 h-screen overflow-x-hidden`}>
      <LoadingProvider>{children}</LoadingProvider>
    </div>
  );
}
