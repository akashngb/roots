import { useAuth0 } from '@auth0/auth0-react';

export function useRootsUser() {
    const { user, isAuthenticated, isLoading, logout } = useAuth0();

    const phone = (user as any)?.user_metadata?.phone_number || user?.phone_number;
    const whatsappId = phone ? `whatsapp:${phone}` : null;

    return {
        user,
        isAuthenticated,
        isLoading,
        logout,
        phone,
        whatsappId,
        displayName: user?.name || user?.email || 'Newcomer',
        picture: user?.picture
    };
}
