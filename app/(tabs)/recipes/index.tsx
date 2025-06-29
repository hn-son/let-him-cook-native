import RecipeCard from '@/components/RecipeCard';
import { ParamsProps, useRecipes } from '@/hooks/useRecipes';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipesScreen() {
    const [params, setParams] = useState<ParamsProps>({
        search: '',
        authorId: null
    });
    const [refetching, setRefetching] = useState(false);
    const { recipes, loading, error, refetch } = useRecipes(params);
    console.log('Recipes error: ', error);
    const router = useRouter();

    const handleRecipePress = (id: string) => {
        router.push(`/recipes/${id}` as any);
    };

    const handleAddRecipe = () => {
        router.push('/recipes/create' as any);
    };

    const handleRefetch = async () => {
        setRefetching(true);
        try {
            await refetch();
        } catch (error) {
            console.error('Error refetching recipes:', error);
        } finally {
            setRefetching(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Searchbar
                placeholder="Tìm công thức..."
                onChangeText={(text) => setParams(prev => ({ ...prev, search: text }))}
                value={params.search || ''}
                style={styles.searchBar}
            />

            {loading && recipes.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Text>Đã xảy ra lỗi khi tải dữ liệu.</Text>
                </View>
            ) : recipes.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text>Không tìm thấy công thức nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={recipes}
                    renderItem={({ item }) => (
                        <RecipeCard recipe={item} onPress={() => handleRecipePress(item.id)} />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refetching}
                            onRefresh={handleRefetch}
                            colors={['#6200ee']}
                        />
                    }
                />
            )}
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={handleAddRecipe}
                label="Thêm công thức"
                color='#fff'
            />
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
    list: {
        padding: 16,
        paddingBottom: 100,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6200ee',
        color: '#fff',
    },
    labelFab: {
        color: '#fff',
    }
});
