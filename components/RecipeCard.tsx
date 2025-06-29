import { DIFFICULTY } from '@/constants/Difficulty';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RecipeCardProps {
    recipe: {
        id: string;
        title: string;
        description: string;
        imageUrl: string;
        cookingTime: number;
        difficulty: string;
    };
    onPress: () => void;
}

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = (e: any) => {
        console.error('e', e.nativeEvent.error);
        setImageError(true);
    };
    return (
        <Pressable onPress={onPress}>
            <Card style={styles.card}>
                {!imageError && recipe.imageUrl ? (
                    <Image
                        source={{ uri: recipe.imageUrl }}
                        style={styles.image}
                        onError={handleImageError}
                    />
                ) : (
                    <View style={[styles.image, styles.defaultImageContainer]}>
                        <Icon name="food" size={80} color="#CCCCCC" />
                        <Text style={styles.defaultImageText}>Không có hình ảnh</Text>
                    </View>
                )}
                <Card.Content style={styles.content}>
                    <Text variant="titleLarge" style={styles.title}>
                        {recipe.title}
                    </Text>
                    <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                        {recipe.description}
                    </Text>
                    <View style={styles.metaContainer}>
                        <Chip icon={() => <Icon name="clock-outline" size={16} color="#666" />}>
                            {recipe.cookingTime} phút
                        </Chip>
                        <Chip
                            icon={() => <Icon name="chef-hat" size={16} color="#666" />}
                            style={styles.chip}
                        >
                            {DIFFICULTY[recipe.difficulty as keyof typeof DIFFICULTY]}
                        </Chip>
                    </View>
                </Card.Content>
            </Card>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 4,
    },
    image: {
        height: 200,
        width: '100%',
    },
    defaultImageContainer: {
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultImageText: {
        marginTop: 8,
        color: '#999999',
    },
    content: {
        paddingVertical: 12,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        marginBottom: 12,
        opacity: 0.8,
    },
    metaContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        height: 30,
    },
});
