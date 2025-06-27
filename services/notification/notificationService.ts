interface NotificationData {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

type NotificationCallback = (data: NotificationData) => void;

class NotificationService {
    private static instance: NotificationService;
    private listeners: NotificationCallback[] = [];

    private constructor() {}

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public showNotification(data: NotificationData) {
        this.listeners.forEach(callback => callback(data));
    }

    public showSuccess(message: string, duration?: number) {
        this.showNotification({ message, type: 'success', duration });
    }

    public showError(message: string, duration?: number) {
        this.showNotification({ message, type: 'error', duration });
    }

    public showInfo(message: string, duration?: number) {
        this.showNotification({ message, type: 'info', duration });
    }

    public showWarning(message: string, duration?: number) {
        this.showNotification({ message, type: 'warning', duration });
    }

    public onNotification(callback: NotificationCallback) {
        this.listeners.push(callback);
    }

    public removeNotificationListener(callback: NotificationCallback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
}

export default NotificationService.getInstance();
export type { NotificationData };

