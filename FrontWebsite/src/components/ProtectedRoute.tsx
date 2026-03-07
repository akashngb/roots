import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] uppercase tracking-[0.5em] text-charcoal/30 font-bold">
                        Authenticating...
                    </p>
                </div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
