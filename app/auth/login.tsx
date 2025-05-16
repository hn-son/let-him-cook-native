import { useAuth } from '@/hooks/useAuth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text, TextInput, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const router = useRouter();
    const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

    const handleLogin = async () => {
        await login(email, password);
        if (returnTo) {
            router.replace(returnTo as any);
        } else {
            router.replace('/(tabs)/recipes' as any);
        }
    };

    const handleRegister = () => {
        router.push({
            pathname: '/auth/register' as any,
            params: returnTo ? { returnTo } : undefined,
        });
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} onPress={handleBack} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <View style={styles.content}>
                    <Title style={styles.title}>Đăng nhập</Title>

                    {error && <Text style={styles.error}>{error}</Text>}

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        label="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading || !email || !password}
                        style={styles.button}
                    >
                        Đăng nhập
                    </Button>

                    <View style={styles.registerContainer}>
                        <Text>Chưa có tài khoản? </Text>
                        <Button mode="text" onPress={handleRegister} disabled={loading}>
                            Đăng ký
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    keyboardAvoid: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    error: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
});
