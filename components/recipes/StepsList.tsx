import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface Step {
    id: string;
    order: number;
    description: string;
    imageUrl?: string;
}

interface StepsListProps {
    steps: Step[];
}

export default function StepsList({ steps }: StepsListProps) {
    // Sort steps by order
    // const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    return (
        <View style={styles.container}>
            {steps?.map((step, idx) => (
                <Card key={idx} style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge" style={styles.stepNumber}>
                            Bước {idx + 1}:
                        </Text>
                        <Text style={styles.description}>{step}</Text>
                    </Card.Content>
                </Card>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    card: {
        elevation: 2,
    },
    stepNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 12,
    },
});
