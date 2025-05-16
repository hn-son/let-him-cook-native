import { Colors } from '@/constants/Color';
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
        <ApolloProvider client={client}>
            <PaperProvider theme={theme}>
                <SafeAreaProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    />
                </SafeAreaProvider>
            </PaperProvider>
        </ApolloProvider>
    );
}
