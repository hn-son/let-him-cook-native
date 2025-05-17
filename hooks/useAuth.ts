import { LOGIN, REGISTER } from '@/services/graphql/mutations';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

export function useAuth() {
    const { login: storeLogin, logout: storeLogout } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN, {
        onCompleted: data => {
            storeLogin(data.login.user, data.login.token);
            setError(null);
        },
        onError: error => {
            setError(error.message);
        },
    });

    const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER, {
        onCompleted: data => {
            storeLogin(data.register.user, data.register.token);
            setError(null);
        },
        onError: error => {
            setError(error.message);
        },
    });

    const login = (email: string, password: string) => {
        return loginMutation({
            variables: {
                input: { email, password },
            },
        });
    };

    const register = (name: string, email: string, password: string) => {
        registerMutation({
            variables: {
                name,
                email,
                password,
            },
        });
    };

    return {
        login,
        register,
        logout: storeLogout,
        loading: loginLoading || registerLoading,
        error,
    };
}
