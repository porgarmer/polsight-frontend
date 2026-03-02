// hoc/withAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If still loading, do nothing (show spinner)
      if (isLoading) return;

      // If loaded and NOT authenticated, redirect
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, [isLoading, isAuthenticated, router]);

    // ⚠️ CRITICAL: Render nothing or spinner while loading
    // This prevents the "flash" of protected content
    if (isLoading) {
      return (
        <div style={{ 
          display: 'flex', 
          height: '100vh', 
          width: '100%', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{ 
            height: '40px', 
            width: '40px', 
            borderRadius: '50%', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6', 
            animation: 'spin 1s linear infinite' 
          }} />
          <style jsx>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      );
    }

    // If not authenticated, return null (useEffect will redirect)
    if (!isAuthenticated) return null;

    return <Component {...props} />;
  };
}