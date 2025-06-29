import { RecipeItem } from '@/components/RecipeItem';
import { ParamsProps, useRecipes } from '@/hooks/useRecipes';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, FAB, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyRecipesScreen() {
    const { user } = useAuthStore();
    console.log("USER: ", user)
    const router = useRouter();
    const [params, setParams] = useState<ParamsProps>({
        search: '',
        authorId: user?.id,
    });
    const { recipes, loading, error, refetch } = useRecipes(params);

    const [refreshing, setRefreshing] = useState(false);

    const handleRecipePress = (id: string) => {
        router.push(`/recipes/${id}` as any);
    };

    const handleCreateRecipe = () => {
        router.push('/recipes/create' as any);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await refetch();
        } catch (error) {
        } finally {
            setRefreshing(false);
        }
    };

    const renderRecipeItem = ({ item }: { item: any }) => {
        return <RecipeItem recipe={item} onPress={handleRecipePress} />;
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            {params.search ? (
                <>
                    <Text variant="titleMedium" style={styles.emptyTitle}>
                        Không tìm thấy công thức nào
                    </Text>
                    <Text style={styles.emptySubtitle}>Thử tìm kiếm với từ khóa khác</Text>
                </>
            ) : (
                <>
                    <Text variant="titleMedium" style={styles.emptyTitle}>
                        Chưa có công thức nào
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        Tạo công thức đầu tiên của bạn ngay bây giờ!
                    </Text>
                    <Button
                        mode="contained"
                        onPress={handleCreateRecipe}
                        style={styles.createButton}
                    >
                        Tạo công thức
                    </Button>
                </>
            )}
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.headerTitle}>
                Công thức của tôi
            </Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>
                {recipes.length || 0} công thức
            </Text>
        </View>
    );

    if (loading && recipes.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>Đang tải công thức...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Có lỗi khi tải dữ liệu</Text>
                    <Button mode="contained" onPress={handleRefresh}>
                        Thử lại
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Searchbar
                placeholder="Tìm kiếm công thức..."
                onChangeText={text => setParams(prev => ({ ...prev, search: text }))}
                value={params.search || ''}
                style={styles.searchBar}
            />
            <FlatList
                data={recipes}
                renderItem={renderRecipeItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#6200ee']}
                    />
                }
            />
            <FAB icon="plus" style={styles.fab} onPress={handleCreateRecipe} label="Tạo mới" color='#fff'/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        margin: 16,
        elevation: 2,
    },
    header: {
        paddingHorizontal: 4,
        paddingBottom: 16,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        color: '#666',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Space for FAB
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
        textAlign: 'center',
    },
    emptySubtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 24,
        lineHeight: 20,
    },
    createButton: {
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#d32f2f',
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6200ee',
    },
});
