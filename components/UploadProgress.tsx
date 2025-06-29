import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

interface UploadProgressProps {
    visible: boolean;
    progress: number;
    message?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
    visible,
    progress,
    message = 'Đang tải ảnh lên...',
}) => {
    if (!visible) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {message} {Math.round(progress)}%
            </Text>
            <ProgressBar progress={progress / 100} style={styles.progressBar} color="#6200ee" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 60,
        left: 16,
        right: 16,
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    text: {
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 14,
        color: '#333',
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#e0e0e0',
    },
});
