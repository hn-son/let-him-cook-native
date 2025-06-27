import { EventEmitter } from 'events';

export interface NotificationData {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

class NotificationService extends EventEmitter {
    private static instance: NotificationService;

    private constructor() {
        super();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public showNotification(notification: NotificationData): void {
        this.emit('notification', notification);
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

    public onNotification(callback: (data: NotificationData) => void) {
        this.on('notification', callback);
    }

    public removeNotificationListener(callback: (data: NotificationData) => void) {
        this.off('notification', callback);
    }
}

export default NotificationService.getInstance();
