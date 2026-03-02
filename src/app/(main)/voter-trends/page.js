'use client';

import VoterTrendsPage from "@/components/voter-trends/voter-trends";
import { useAuth } from "@/contexts/AuthContext";

export default function page() {

  //  const { isLoading, isAuthenticated } = useAuth();

  // // ⚠️ CRITICAL: Show loader while checking auth
  // if (isLoading) {
  //   return (
  //     <div style={{ 
  //       display: 'flex', 
  //       height: '100vh', 
  //       alignItems: 'center', 
  //       justifyContent: 'center' 
  //     }}>
  //       <div style={{ 
  //         height: '40px', 
  //         width: '40px', 
  //         borderRadius: '50%', 
  //         border: '4px solid #e5e7eb', 
  //         borderTop: '4px solid #3b82f6', 
  //         animation: 'spin 1s linear infinite' 
  //       }} />
  //       <style jsx>{`
  //         @keyframes spin { 
  //           0% { transform: rotate(0deg); } 
  //           100% { transform: rotate(360deg); } 
  //         }
  //       `}</style>
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return null; // Middleware or AuthContext should have redirected
  // }
  
  return (
    <VoterTrendsPage />
  );
}
