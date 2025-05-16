import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TabsLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="recipes/index"
                options={{
                    title: 'Công thức',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="food-fork-drink" size={size} color={color} />
                    ),
                    headerTitle: 'Let him cook',
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: 'Cá nhân',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
