import { useCallback } from 'react';

import notificationService from '@/services/notification/notificationService';

export function useNotification() {
    const showSuccess = useCallback((message: string, duration?: number) => {
        notificationService.showSuccess(message, duration);
    }, []);

    const showError = useCallback((message: string, duration?: number) => {
        notificationService.showError(message, duration);
    }, []);

    const showInfo = useCallback((message: string, duration?: number) => {
        notificationService.showInfo(message, duration);
    }, []);

    const showWarning = useCallback((message: string, duration?: number) => {
        notificationService.showWarning(message, duration);
    }, []);

    const showNotification = useCallback(
        (message: string, type: 'success' | 'error' | 'info' | 'warning', duration?: number) => {
            notificationService.showNotification({ message, type, duration });
        },
        []
    );

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showNotification,
    };
}
