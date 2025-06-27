import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, ViewStyle } from 'react-native';

interface KeyboardAvoidingWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    scrollEnabled?: boolean;
    keyboardVerticalOffset?: number;
    behavior?: 'height' | 'position' | 'padding';
}

const KeyboardAvoidingWrapper = ({
    children,
    style,
    scrollEnabled = true,
    keyboardVerticalOffset,
    behavior,
}: KeyboardAvoidingWrapperProps) => {
    const defaultBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
    const defaultOffset = Platform.OS === 'ios' ? 0 : 0;

    if (scrollEnabled) {
        return (
            <KeyboardAvoidingView
                style={[styles.container, style]}
                behavior={behavior || defaultBehavior}
                keyboardVerticalOffset={keyboardVerticalOffset || defaultOffset}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, style]}
            behavior={behavior || defaultBehavior}
            keyboardVerticalOffset={keyboardVerticalOffset || defaultOffset}
        >
            {children}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
});

export default KeyboardAvoidingWrapper;
