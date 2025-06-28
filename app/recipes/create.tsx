import { DIFFICULTY } from '@/constants/Difficulty';
import { useNotification } from '@/hooks/useNotification';
import { useAddRecipe, useRecipeDetails } from '@/hooks/useRecipes';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Divider,
    IconButton,
    Menu,
    Text,
    TextInput,
    Title,
} from 'react-native-paper';

interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

interface Step {
    content: string;
}

export default function CreateRecipeScreen() {
    const router = useRouter();
    const { showSuccess, showError } = useNotification();
    const { submitRecipe, loading, error } = useAddRecipe();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const isEditMode = !!id;

    const {
        recipe,
        loading: loadingRecipe,
        error: errorRecipe,
    } = useRecipeDetails(isEditMode ? id : '');

    const [formState, setFormState] = useState({
        title: '',
        description: '',
        ingredients: [] as Ingredient[],
        steps: [] as Step[],
        cookingTime: 0,
        difficulty: 'easy' as keyof typeof DIFFICULTY,
        imageUrl: '',
    });

    const [difficultyMenuVisible, setDifficultyMenuVisible] = useState(false);

    const [newIngredient, setNewIngredient] = useState({
        name: '',
        quantity: 0,
        unit: '',
    });
    const [showIngredientForm, setShowIngredientForm] = useState(false);

    const [newStep, setNewStep] = useState('');
    const [showStepForm, setShowStepForm] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const pickImage = () => {};

    const addIngredient = () => {
        if (newIngredient.name.trim() && newIngredient.quantity > 0 && newIngredient.unit.trim()) {
            const ingredient: Ingredient = {
                name: newIngredient.name,
                quantity: newIngredient.quantity,
                unit: newIngredient.unit,
            };

            setFormState(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, ingredient],
            }));
            setNewIngredient({
                name: '',
                quantity: 0,
                unit: '',
            });
            setShowIngredientForm(false);
        }
    };

    const removeIngredient = (index: number) => {
        setFormState(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    const addStep = () => {
        if (newStep.trim()) {
            const step: Step = {
                content: newStep,
            };
            setFormState(prev => ({
                ...prev,
                steps: [...prev.steps, step],
            }));
            setNewStep('');
            setShowStepForm(false);
        }
    };

    const removeStep = (index: number) => {
        setFormState(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formState.title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
        if (!formState.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';
        if (isNaN(Number(formState.cookingTime)) || Number(formState.cookingTime) <= 0) {
            newErrors.cookingTime = 'Thời gian nấu phải là số dương';
        }
        if (formState.ingredients.length === 0)
            newErrors.ingredients = 'Cần ít nhất một nguyên liệu';
        if (formState.steps.length === 0) newErrors.steps = 'Cần ít nhất một bước thực hiện';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChangeFormState = (field: string, value: any) => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
        setFormState(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!validateForm()) {
            showError('Vui lòng kiểm tra lại thông tin');
            return;
        }

        try {
            const recipeData = {
                title: formState.title.trim(),
                description: formState.description.trim(),
                cookingTime: Number(formState.cookingTime),
                difficulty: formState.difficulty,
                ingredients: formState.ingredients.map(ingredient => ({
                    name: ingredient.name,
                    quantity: ingredient.quantity.toString(),
                    unit: ingredient.unit,
                })),
                steps: formState.steps.map(step => step.content),
                imageUrl: '',
            };
            await submitRecipe(recipeData);
        } catch (error) {
            console.error(error);
            showError('Đã xảy ra lỗi khi tạo công thức. Hãy thử lại sau');
        }
    };

    useEffect(() => {
        if (isEditMode && recipe) {
            setFormState({
                title: recipe.title,
                description: recipe.description,
                ingredients: recipe.ingredients.map((ingredient: Ingredient) => ({
                    name: ingredient.name,
                    quantity: Number(ingredient.quantity),
                    unit: ingredient.unit,
                })),
                steps: recipe.steps,
                cookingTime: recipe.cookingTime,
                difficulty: recipe.difficulty,
                imageUrl: recipe.imageUrl || '',
            });
        }
    }, [isEditMode, recipe]);

    if (isEditMode && loadingRecipe) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Tạo công thức mới',
                    headerStyle: {
                        backgroundColor: '#6200ee',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerRight: () => (
                        <Button
                            mode="text"
                            onPress={handleSave}
                            loading={loading}
                            disabled={loading}
                            textColor="#fff"
                        >
                            Lưu
                        </Button>
                    ),
                }}
            />
            <ScrollView style={styles.container}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    {/* {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : ( */}
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>Chưa có ảnh</Text>
                    </View>
                    {/* )} */}
                    <Button
                        mode="contained"
                        onPress={pickImage}
                        style={styles.imageButton}
                        icon="camera"
                    >
                        {formState.imageUrl ? 'Đổi ảnh' : 'Thêm ảnh'}
                    </Button>
                </View>

                <View style={styles.content}>
                    {/* Basic Info */}
                    <TextInput
                        label="Tên công thức *"
                        value={formState.title}
                        onChangeText={text => handleChangeFormState('title', text)}
                        style={styles.input}
                        mode="outlined"
                        error={!!errors.title}
                    />
                    {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

                    <TextInput
                        label="Mô tả *"
                        value={formState.description}
                        onChangeText={text => handleChangeFormState('description', text)}
                        style={styles.input}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        error={!!errors.description}
                    />
                    {errors.description && (
                        <Text style={styles.errorText}>{errors.description}</Text>
                    )}

                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <TextInput
                                label="Thời gian (phút) *"
                                value={formState.cookingTime.toString()}
                                onChangeText={text => handleChangeFormState('cookingTime', text)}
                                style={styles.timeInput}
                                mode="outlined"
                                keyboardType="numeric"
                                error={!!errors.cookingTime}
                            />
                            {errors.cookingTime && (
                                <Text style={styles.errorText}>{errors.cookingTime}</Text>
                            )}
                        </View>
                        <View style={styles.metaItem}>
                            <Menu
                                visible={difficultyMenuVisible}
                                onDismiss={() => setDifficultyMenuVisible(false)}
                                anchor={
                                    <Button
                                        mode="outlined"
                                        onPress={() => setDifficultyMenuVisible(true)}
                                        style={styles.difficultyButton}
                                    >
                                        {DIFFICULTY[formState.difficulty]}
                                    </Button>
                                }
                            >
                                {Object.entries(DIFFICULTY).map(([key, value]) => (
                                    <Menu.Item
                                        key={key}
                                        onPress={() => {
                                            handleChangeFormState(
                                                'difficulty',
                                                key as keyof typeof DIFFICULTY
                                            );
                                            setDifficultyMenuVisible(false);
                                        }}
                                        title={value}
                                    />
                                ))}
                            </Menu>
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    {/* Ingredients Section */}
                    <View style={styles.sectionHeader}>
                        <Title style={styles.sectionTitle}>Nguyên liệu</Title>
                        <Button
                            mode="contained"
                            onPress={() => setShowIngredientForm(true)}
                            icon="plus"
                            compact
                        >
                            Thêm
                        </Button>
                    </View>

                    {showIngredientForm && (
                        <Card style={styles.formCard}>
                            <Card.Content>
                                <TextInput
                                    label="Tên nguyên liệu"
                                    value={newIngredient.name}
                                    onChangeText={text =>
                                        setNewIngredient({ ...newIngredient, name: text })
                                    }
                                    style={styles.input}
                                    mode="outlined"
                                />
                                <View style={styles.ingredientRow}>
                                    <TextInput
                                        label="Số lượng"
                                        value={newIngredient.quantity.toString()}
                                        onChangeText={text =>
                                            setNewIngredient({
                                                ...newIngredient,
                                                quantity: Number(text),
                                            })
                                        }
                                        style={styles.quantityInput}
                                        mode="outlined"
                                    />
                                    <TextInput
                                        label="Đơn vị"
                                        value={newIngredient.unit}
                                        onChangeText={text =>
                                            setNewIngredient({ ...newIngredient, unit: text })
                                        }
                                        style={styles.unitInput}
                                        mode="outlined"
                                    />
                                </View>
                                <View style={styles.formButtons}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => {
                                            setShowIngredientForm(false);
                                            setNewIngredient({ name: '', quantity: 0, unit: '' });
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={addIngredient}
                                        disabled={
                                            !newIngredient.name.trim() ||
                                            newIngredient.quantity === 0
                                        }
                                    >
                                        Thêm
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    )}

                    {formState.ingredients.map((ingredient, index) => (
                        <View key={ingredient.name || index} style={styles.ingredientItem}>
                            <View style={styles.ingredientInfo}>
                                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                                <Text style={styles.ingredientQuantity}>
                                    {ingredient.quantity} {ingredient.unit}
                                </Text>
                            </View>
                            <IconButton
                                icon="delete"
                                size={20}
                                onPress={() => removeIngredient(index)}
                            />
                        </View>
                    ))}
                    {errors.ingredients && (
                        <Text style={styles.errorText}>{errors.ingredients}</Text>
                    )}

                    <Divider style={styles.divider} />

                    {/* Steps Section */}
                    <View style={styles.sectionHeader}>
                        <Title style={styles.sectionTitle}>Các bước thực hiện</Title>
                        <Button
                            mode="contained"
                            onPress={() => setShowStepForm(true)}
                            icon="plus"
                            compact
                        >
                            Thêm
                        </Button>
                    </View>

                    {showStepForm && (
                        <Card style={styles.formCard}>
                            <Card.Content>
                                <TextInput
                                    label="Hướng dẫn thực hiện"
                                    value={newStep}
                                    onChangeText={setNewStep}
                                    style={styles.input}
                                    mode="outlined"
                                    multiline
                                    numberOfLines={3}
                                />
                                <View style={styles.formButtons}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => {
                                            setShowStepForm(false);
                                            setNewStep('');
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={addStep}
                                        disabled={!newStep.trim()}
                                    >
                                        Thêm
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    )}

                    {formState.steps.map((step, index) => (
                        <View key={step.toString() || index} style={styles.stepItem}>
                            <View style={styles.stepHeader}>
                                <Text style={styles.stepNumber}>Bước {index + 1}</Text>
                                <IconButton
                                    icon="delete"
                                    size={20}
                                    onPress={() => removeStep(index)}
                                />
                            </View>
                            <Text style={styles.stepInstruction}>{step.toString()}</Text>
                        </View>
                    ))}
                    {errors.steps && <Text style={styles.errorText}>{errors.steps}</Text>}

                    <View style={styles.bottomPadding} />
                </View>
            </ScrollView>
        </>
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
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 250,
    },
    imagePlaceholder: {
        width: '100%',
        height: 250,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        color: '#666',
        fontSize: 16,
    },
    imageButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    content: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 8,
        marginLeft: 12,
    },
    metaContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 16,
    },
    metaItem: {
        flex: 1,
    },
    timeInput: {
        flex: 1,
    },
    difficultyButton: {
        flex: 1,
        justifyContent: 'center',
    },
    divider: {
        marginVertical: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 0,
    },
    formCard: {
        marginBottom: 16,
        elevation: 2,
    },
    ingredientRow: {
        flexDirection: 'row',
        gap: 12,
    },
    quantityInput: {
        flex: 2,
    },
    unitInput: {
        flex: 1,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 16,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 8,
    },
    ingredientInfo: {
        flex: 1,
    },
    ingredientName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    ingredientQuantity: {
        fontSize: 14,
        color: '#666',
    },
    stepItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    stepHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ee',
    },
    stepInstruction: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    bottomPadding: {
        height: 50,
    },
});
