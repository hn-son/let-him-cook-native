import RecipeCard from '@/components/recipes/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipesScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const { recipes, loading, error } = useRecipes(searchQuery);
    console.log(error)
    const router = useRouter();

    const handleRecipePress = (id: string) => {
        router.push(`/recipes/${id}` as any);
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Searchbar
                placeholder="Tìm công thức..."
                onChangeText={setSearchQuery}
                value={searchQuery}
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
                />
            )}
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
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
