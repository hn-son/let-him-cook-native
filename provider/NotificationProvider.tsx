import NotificationService, { NotificationData } from '@/services/notification/notificationService';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NotificationProviderProps {
    children: React.ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
    const [notification, setNotification] = useState<NotificationData | null>(null);
    const [visible, setVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const slideAnim = useState(new Animated.Value(-100))[0];

    useEffect(() => {
        const handleNotification = (data: NotificationData) => {
            setNotification(data);
            setVisible(true);

            // Animate slide down
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Auto hide after duration
            const duration = data.duration || 3000;
            setTimeout(() => {
                hideNotification();
            }, duration);
        };

        NotificationService.onNotification(handleNotification);

        return () => {
            NotificationService.removeNotificationListener(handleNotification);
        };
    }, [slideAnim]);

    const hideNotification = () => {
        // Animate slide up
        Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
            setNotification(null);
        });
    };

    const getNotificationStyle = (type: string) => {
        switch (type) {
            case 'success':
                return styles.successNotification;
            case 'error':
                return styles.errorNotification;
            case 'warning':
                return styles.warningNotification;
            case 'info':
                return styles.infoNotification;
            default:
                return styles.defaultNotification;
        }
    };

    const getTextColor = (type: string) => {
        return 'white';
    };

    return (
        <>
            {children}
            {visible && notification && (
                <Animated.View
                    style={[
                        styles.notificationContainer,
                        {
                            top: insets.top,
                            transform: [{ translateY: slideAnim }],
                        },
                        getNotificationStyle(notification.type),
                    ]}
                >
                    <View style={styles.notificationContent}>
                        <Text
                            style={[
                                styles.notificationText,
                                { color: getTextColor(notification.type) },
                            ]}
                            numberOfLines={2}
                        >
                            {notification.message}
                        </Text>
                        <Text style={styles.closeButton} onPress={hideNotification}>
                            ✕
                        </Text>
                    </View>
                </Animated.View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    notificationContainer: {
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 9999,
        borderRadius: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        minHeight: 56,
    },
    notificationText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        marginRight: 12,
    },
    closeButton: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        padding: 4,
    },
    successNotification: {
        backgroundColor: '#4CAF50',
    },
    errorNotification: {
        backgroundColor: '#F44336',
    },
    warningNotification: {
        backgroundColor: '#FF9800',
    },
    infoNotification: {
        backgroundColor: '#2196F3',
    },
    defaultNotification: {
        backgroundColor: '#323232',
    },
});
