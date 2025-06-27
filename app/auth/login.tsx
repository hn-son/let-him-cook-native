import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const router = useRouter();
    const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        if (error) {
            showError('Đăng nhập thất bại');
        }
    }, [error, showError]);

    const handleLogin = async () => {
        try {
            const res = await login(email, password);
            console.log('Login log: ', res);
            if (res.data) {
                showSuccess('Đăng nhập thành công!');

                setTimeout(() => {
                    if (returnTo) {
                        router.replace(returnTo as any);
                    } else {
                        router.replace('/(tabs)/recipes' as any);
                    }
                }, 1000);
            } else {
                throw new Error('Đăng nhập thất bại');
            }
        } catch (err) {
            console.error(err);
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
                    <Text variant="titleLarge" style={styles.title}>
                        Đăng nhập
                    </Text>

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
    snackbar: {
        margin: 16,
    },
    successSnackbar: {
        backgroundColor: '#4CAF50',
    },
    errorSnackbar: {
        backgroundColor: '#F44336',
    },
});
