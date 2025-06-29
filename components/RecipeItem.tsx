import { DIFFICULTY } from '@/constants/Difficulty';
import { formatDate } from '@/utils';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip, IconButton, Menu, Text } from 'react-native-paper';

interface Recipe {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    cookingTime: number | string;
    difficulty: keyof typeof DIFFICULTY;
    createdAt: string;
}

interface RecipeItemProps {
    recipe: Recipe;
    onPress: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

export const RecipeItem: React.FC<RecipeItemProps> = ({
    recipe,
    onPress,
    onDelete,
    onEdit,
    showActions,
}) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const handleMenuPress = () => {
        setMenuVisible(true);
    };

    const handleEdit = () => {
        setMenuVisible(false);
        onEdit?.(recipe.id);
    };

    const handleDelete = () => {
        setMenuVisible(false);
        onDelete?.(recipe.id);
    };

    return (
        <Card style={styles.card} mode="outlined">
            <Pressable onPress={() => onPress(recipe.id)}>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        {recipe.imageUrl ? (
                            <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.imagePlaceholderText}>Không có ảnh</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.content}>
                        <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
                            {recipe.title}
                        </Text>
                        <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
                            {recipe.description}
                        </Text>

                        <View style={styles.meta}>
                            <Chip
                                icon="clock-outline"
                                style={styles.chip}
                                textStyle={styles.chipText}
                                compact
                            >
                                {recipe.cookingTime}p
                            </Chip>
                            <Chip
                                style={[styles.chip, styles.difficultyChip]}
                                textStyle={styles.chipText}
                                compact
                            >
                                {DIFFICULTY[recipe.difficulty]}
                            </Chip>
                        </View>

                        <Text variant="bodySmall" style={styles.date}>
                            {formatDate(recipe.createdAt)}
                        </Text>
                    </View>

                    {showActions && (onEdit || onDelete) && (
                        <View style={styles.actionsContainer}>
                            <Menu
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                anchor={
                                    <IconButton
                                        icon="dots-vertical"
                                        size={20}
                                        onPress={handleMenuPress}
                                    />
                                }
                            >
                                {onEdit && (
                                    <Menu.Item
                                        onPress={handleEdit}
                                        title="Chỉnh sửa"
                                        leadingIcon="pencil"
                                    />
                                )}
                                {onDelete && (
                                    <Menu.Item
                                        onPress={handleDelete}
                                        title="Xóa"
                                        leadingIcon="delete"
                                        titleStyle={{ color: '#d32f2f' }}
                                    />
                                )}
                            </Menu>
                        </View>
                    )}
                </View>
            </Pressable>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        backgroundColor: '#fff',
        elevation: 1,
    },
    container: {
        flexDirection: 'row',
        padding: 12,
    },
    imageContainer: {
        width: 80,
        height: 80,
        marginRight: 12,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
        lineHeight: 20,
    },
    description: {
        color: '#666',
        marginBottom: 8,
        lineHeight: 16,
    },
    meta: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 6,
    },
    chip: {
        backgroundColor: '#f0f0f0',
        display: "flex",
        alignItems: "center",
    },
    difficultyChip: {
        backgroundColor: '#e8f5e8',
    },
    chipText: {
        fontSize: 12,
        color: '#666',
    },
    date: {
        color: '#999',
        fontSize: 11,
    },
    actionsContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
});
