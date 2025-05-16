import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RecipeCardProps {
    recipe: {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        cookTime: number;
        difficulty: string;
    };
    onPress: () => void;
}

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
    return (
        <Pressable onPress={onPress}>
            <Card style={styles.card}>
                <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
                <Card.Content style={styles.content}>
                    <Text variant="titleLarge" style={styles.title}>
                        {recipe.name}
                    </Text>
                    <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                        {recipe.description}
                    </Text>
                    <View style={styles.metaContainer}>
                        <Chip icon={() => <Icon name="clock-outline" size={16} color="#666" />}>
                            {recipe.cookTime} phút
                        </Chip>
                        <Chip
                            icon={() => <Icon name="chef-hat" size={16} color="#666" />}
                            style={styles.chip}
                        >
                            {recipe.difficulty}
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
