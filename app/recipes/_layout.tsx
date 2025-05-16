import { Stack } from 'expo-router';

export default function RecipeLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Chi tiết công thức',
                }}
            />
        </Stack>
    );
}
