
import { Toaster } from "@/components/ui/sonner";
import "./global.css";
import AppShell from "@/components/layout/app-shell";

export const metadata = {
  title: "Dashboard",
  description: "Election Forecasting and Strategic Decision Support System"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
