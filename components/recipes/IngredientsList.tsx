import { StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';

interface Ingredient {
    id: string;
    name: string;
    quantity: string;
    unit: string;
}

interface IngredientsListProps {
    ingredients: Ingredient[];
}

export default function IngredientsList({ ingredients }: IngredientsListProps) {
    return (
        <View style={styles.container}>
            {ingredients?.map(ingredient => (
                <List.Item
                    key={ingredient.id}
                    title={ingredient.name}
                    description={`${ingredient.quantity} ${ingredient.unit}`}
                    left={props => <List.Icon {...props} icon="food-variant" />}
                    style={styles.item}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        overflow: 'hidden',
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});
