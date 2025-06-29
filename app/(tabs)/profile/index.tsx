import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Divider, Icon, Text } from 'react-native-paper';
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

    const handleMyRecipes = () => {
        router.push('/profile/my-recipes' as any);
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text variant="titleLarge" style={styles.title}>
                        Bạn chưa đăng nhập
                    </Text>
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
                        label={user?.username?.substring(0, 1).toUpperCase() || 'U'}
                    />
                    <Text variant="titleLarge" style={styles.name}>
                        {user?.username}
                    </Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.menuContainer}>
                    {/* My Recipes Card */}
                    <Pressable onPress={handleMyRecipes}>
                        <Card style={styles.menuCard} mode="outlined">
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.cardLeft}>
                                    <Icon source="book-open-variant" size={24} color="#6200ee" />
                                    <View style={styles.cardText}>
                                        <Text variant="titleMedium" style={styles.cardTitle}>
                                            Công thức đã tạo
                                        </Text>
                                    </View>
                                </View>
                                <Icon source="chevron-right" size={20} color="#666" />
                            </Card.Content>
                        </Card>
                    </Pressable>

                    {/* Commented Recipes Card - Coming Soon */}
                    <Card style={[styles.menuCard, styles.disabledCard]} mode="outlined">
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardLeft}>
                                <Icon source="comment-text" size={24} color="#999" />
                                <View style={styles.cardText}>
                                    <Text
                                        variant="titleMedium"
                                        style={[styles.cardTitle, styles.disabledText]}
                                    >
                                        Công thức đã bình luận
                                    </Text>
                                    <Text
                                        variant="bodySmall"
                                        style={[styles.cardSubtitle, styles.disabledText]}
                                    >
                                        Chức năng đang phát triển
                                    </Text>
                                </View>
                            </View>
                            <Icon source="lock" size={20} color="#999" />
                        </Card.Content>
                    </Card>

                    {/* Favorites Card - Coming Soon */}
                    <Card style={[styles.menuCard, styles.disabledCard]} mode="outlined">
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.cardLeft}>
                                <Icon source="heart" size={24} color="#999" />
                                <View style={styles.cardText}>
                                    <Text
                                        variant="titleMedium"
                                        style={[styles.cardTitle, styles.disabledText]}
                                    >
                                        Công thức yêu thích
                                    </Text>
                                    <Text
                                        variant="bodySmall"
                                        style={[styles.cardSubtitle, styles.disabledText]}
                                    >
                                        Chức năng đang phát triển
                                    </Text>
                                </View>
                            </View>
                            <Icon source="lock" size={20} color="#999" />
                        </Card.Content>
                    </Card>
                </View>

                <View style={styles.logoutContainer}>
                    <Button
                        mode="outlined"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        textColor="#d32f2f"
                        icon="logout"
                    >
                        Đăng xuất
                    </Button>
                </View>
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
        color: '#666',
        lineHeight: 20,
    },
    button: {
        width: '80%',
    },
    header: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f8f9fa',
    },
    avatar: {
        backgroundColor: '#6200ee',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 16,
        color: '#333',
    },
    email: {
        fontSize: 16,
        opacity: 0.7,
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    statNumber: {
        fontWeight: 'bold',
        color: '#6200ee',
    },
    statLabel: {
        color: '#666',
        marginTop: 4,
    },
    divider: {
        marginVertical: 8,
    },
    menuContainer: {
        padding: 16,
        gap: 12,
    },
    menuCard: {
        backgroundColor: '#fff',
        elevation: 1,
    },
    disabledCard: {
        opacity: 0.6,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardText: {
        marginLeft: 16,
        flex: 1,
    },
    cardTitle: {
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    cardSubtitle: {
        color: '#666',
    },
    disabledText: {
        color: '#999',
    },
    logoutContainer: {
        padding: 16,
        paddingTop: 8,
    },
    logoutButton: {
        borderColor: '#d32f2f',
    },
});
