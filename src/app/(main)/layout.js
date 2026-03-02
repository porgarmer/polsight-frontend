import { Toaster } from "@/components/ui/sonner";
import "../global.css";
import AppShell from "@/components/layout/app-shell";
import { AuthProvider } from "@/contexts/AuthContext";


export const metadata = {
  title: "Dashboard",
  description: "Election Forecasting and Strategic Decision Support System"
};

export default function RootLayout({ children }) {
  return (
  <>
    {/* <AuthProvider> */}
      <AppShell>
        {children}
      </AppShell>
      <Toaster />
    {/* </AuthProvider> */}
  </>
  );
}
