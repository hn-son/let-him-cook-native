import CommentSection from '@/components/CommentSection';
import IngredientsList from '@/components/IngredientsList';
import StepsList from '@/components/StepsList';
import { DIFFICULTY } from '@/constants/Difficulty';
import { useRecipeDetails } from '@/hooks/useRecipes';
import { useAuthStore } from '@/store/authStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, Text, Title } from 'react-native-paper';

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { recipe, loading, error } = useRecipeDetails(id);
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const handleCommentPress = () => {
        if (!isAuthenticated) {
            router.push(`/auth/login?returnTo=/recipes/${id}` as any);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error || !recipe) {
        return (
            <View style={styles.centerContainer}>
                <Text>Đã xảy ra lỗi khi tải dữ liệu.</Text>
                <Button mode="contained" onPress={() => router.back()} style={styles.button}>
                    Quay lại
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: recipe.imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <Title style={styles.title}>{recipe.title}</Title>
                <Text style={styles.description}>{recipe.description}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Thời gian</Text>
                        <Text style={styles.metaValue}>{recipe.cookingTime} phút</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Độ khó</Text>
                        <Text style={styles.metaValue}>
                            {DIFFICULTY[recipe.difficulty as keyof typeof DIFFICULTY]}
                        </Text>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <Title style={styles.sectionTitle}>Nguyên liệu</Title>
                <IngredientsList ingredients={recipe.ingredients} />

                <Divider style={styles.divider} />

                <Title style={styles.sectionTitle}>Các bước thực hiện</Title>
                <StepsList steps={recipe.steps} />

                <Divider style={styles.divider} />

                <Title style={styles.sectionTitle}>Bình luận</Title>
                <CommentSection
                    recipeId={id}
                    isAuthenticated={isAuthenticated}
                    onCommentPress={handleCommentPress}
                    currentUSerId={user?.id}
                />
            </View>
        </ScrollView>
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
    button: {
        marginTop: 16,
    },
    image: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        marginTop: 8,
        fontSize: 16,
        lineHeight: 24,
    },
    metaContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    metaItem: {
        marginRight: 24,
    },
    metaLabel: {
        fontSize: 14,
        color: '#666',
    },
    metaValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 16,
    },
});
