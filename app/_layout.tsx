import { Colors } from '@/constants/Color';
import KeyboardAvoidingWrapper from '@/provider/KeyboardAvoidingWrapper';
import NotificationProvider from '@/provider/NotificationProvider';
import { client } from '@/services/graphql/client';
import { ApolloProvider } from '@apollo/client';
import { Stack } from 'expo-router';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const theme = {
    ...MD3LightTheme,
    color: {
        ...MD3LightTheme.colors,
        primary: Colors.primary,
        accent: Colors.secondary,
        background: Colors.background,
        text: Colors.text,
    },
};

export default function RootLayout() {
    return (
        <NotificationProvider>
            <ApolloProvider client={client}>
                <PaperProvider theme={theme}>
                    <SafeAreaProvider>
                        <KeyboardAvoidingWrapper>
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                }}
                            />
                        </KeyboardAvoidingWrapper>
                    </SafeAreaProvider>
                </PaperProvider>
            </ApolloProvider>
        </NotificationProvider>
    );
}
