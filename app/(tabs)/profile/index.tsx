import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Divider, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    const handleLogin = () => {
        router.push('/auth/login' as any);
    };

    const handleLogout = () => {
        logout();
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text variant='titleLarge' style={styles.title}>Bạn chưa đăng nhập</Text>
                    <Text style={styles.subtitle}>
                        Đăng nhập để lưu công thức yêu thích và bình luận
                    </Text>
                    <Button mode="contained" onPress={handleLogin} style={styles.button}>
                        Đăng nhập
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Avatar.Text
                        size={80}
                        label={user?.name?.substring(0, 2).toUpperCase() || 'U'}
                    />
                    <Text variant='titleLarge' style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                <Divider style={styles.divider} />

                <Card style={styles.card}>
                    <Card.Title title="Công thức đã lưu" />
                    <Card.Content>
                        <Text>Chức năng đang phát triển</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Title title="Công thức đã bình luận" />
                    <Card.Content>
                        <Text>Chức năng đang phát triển</Text>
                    </Card.Content>
                </Card>

                <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
                    Đăng xuất
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        width: '80%',
    },
    header: {
        alignItems: 'center',
        padding: 24,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 16,
    },
    email: {
        fontSize: 16,
        opacity: 0.7,
    },
    divider: {
        marginBottom: 16,
    },
    card: {
        margin: 16,
        marginTop: 0,
    },
    logoutButton: {
        margin: 16,
    },
});
