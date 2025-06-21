import { useAddComment, useComments } from '@/hooks/useComments';
import { formatDate } from '@/utils';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text, TextInput } from 'react-native-paper';

interface Comment {
    id: string;
    text: string;
    createdAt: string;
    updatedAt?: string;
    user: {
        id: string;
        name: string;
    };
}

interface CommentSectionProps {
    recipeId: string;
    isAuthenticated: boolean;
    onCommentPress: () => void;
}

export default function CommentSection({
    recipeId,
    isAuthenticated,
    onCommentPress,
}: CommentSectionProps) {
    const [commentText, setCommentText] = useState('');
    const { submitComment, loading } = useAddComment();
    const { data: comments, loading: commentLoading, error: commentError } = useComments(recipeId);
    console.log('Comments data: ', comments);

    const handleAddComment = async () => {
        if (commentText.trim()) {
            console.log('Submitting comment:', commentText);
            await submitComment(recipeId, commentText);
            setCommentText('');
        }
    };

    const isComementEdited = (createdAt: string, updatedAt?: string) => {
        try {
            return createdAt !== updatedAt;
        } catch (error) {
            console.error('Error checking comment edit status:', error);
            return false;
        }
    };

    const getDateDisplay = (comment: Comment) => {
        const isEdited = isComementEdited(comment.createdAt, comment.updatedAt);
        const formattedDate = formatDate(comment.createdAt);
        return isEdited ? `${formattedDate} (Đã chỉnh sửa)` : formattedDate;
    };

    const getAvatarLabel = (username: string) => {
        return username.charAt(0).toUpperCase();
    };

    return (
        <View style={styles.container}>
            {/* Phần gửi bình luận - Di chuyển lên trên */}
            {isAuthenticated ? (
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Thêm bình luận"
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                        style={styles.input}
                    />
                    <Button
                        mode="contained"
                        onPress={handleAddComment}
                        loading={loading}
                        disabled={loading || !commentText.trim()}
                    >
                        Gửi
                    </Button>
                </View>
            ) : (
                <Button mode="contained" onPress={onCommentPress} style={styles.loginButton}>
                    Đăng nhập để bình luận
                </Button>
            )}

            {/* Danh sách bình luận */}
            {comments?.map(comment => (
                <Card key={comment.id} style={styles.commentCard}>
                    <Card.Content>
                        <View style={styles.commentHeader}>
                            <Avatar.Text
                                size={32}
                                label={getAvatarLabel(comment.author.username)}
                                style={styles.avatar}
                            />
                            <View style={styles.authorInfo}>
                                <Text variant="titleMedium" style={styles.authorName}>
                                    {comment.author.username}
                                </Text>
                                <Text variant="bodySmall" style={styles.date}>
                                    {getDateDisplay(comment)}
                                </Text>
                            </View>
                        </View>
                        <Text variant="bodyMedium" style={styles.commentContent}>
                            {comment.content}
                        </Text>
                    </Card.Content>
                </Card>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    inputContainer: {
        marginBottom: 16,
        gap: 8,
    },
    input: {
        backgroundColor: 'transparent',
    },
    loginButton: {
        marginBottom: 16,
    },
    commentCard: {
        marginBottom: 8,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    avatar: {
        marginRight: 12,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    date: {
        opacity: 0.6,
    },
    commentContent: {
        marginLeft: 44, // Căn chỉnh với text bên trên (32px avatar + 12px margin)
    },
});
