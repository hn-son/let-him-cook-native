import { useAddComment, useComments, useUpdateComment } from '@/hooks/useComments';
import { formatDate } from '@/utils';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, IconButton, Menu, Text, TextInput } from 'react-native-paper';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    author: {
        id: string;
        username: string;
    };
}

interface CommentSectionProps {
    recipeId: string;
    isAuthenticated: boolean;
    onCommentPress: () => void;
    currentUSerId?: string;
}

export default function CommentSection({
    recipeId,
    isAuthenticated,
    onCommentPress,
    currentUSerId,
}: CommentSectionProps) {
    const [commentText, setCommentText] = useState('');
    const { submitComment, loading } = useAddComment();
    const { data: comments, loading: commentLoading, error: commentError } = useComments(recipeId);
    console.log('Comments data: ', comments);
    const {
        submitComment: updateComment,
        loading: updateLoading,
        error: updateError,
    } = useUpdateComment();
    const [menuVisible, setMenuVisible] = useState<string | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
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

    const handleEditComment = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditingText(comment.content);
        setMenuVisible(null);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingText('');
    };

    const handleUpdateComment = async (commentId: string) => {
        if (editingText.trim()) {
            await updateComment(commentId, editingText);
            setEditingCommentId(null);
            setEditingText('');
        }
    };

    const handleDeleteComment = (commentId: string) => {
        Alert.alert('Xóa bình luận', 'Bạn có chắc chắn muốn xóa bình luận này?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', style: 'destructive', onPress: async () => {} },
        ]);
    };

    const handleLongPress = (comment: Comment) => {
        if (currentUSerId === comment.author.id) {
            setMenuVisible(comment.id);
        }
    };

    const isOwnComment = (comment: Comment) => {
        return comment.author.id === currentUSerId;
    };

    return (
        <View style={styles.container}>
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
            {comments?.map((comment: any) => (
                <Pressable
                    key={comment.id}
                    onLongPress={() => handleLongPress(comment)}
                    delayLongPress={500}
                >
                    <Card
                        style={[styles.commentCard, isOwnComment(comment) && styles.ownCommentCard]}
                    >
                        <Card.Content>
                            <View style={styles.commentHeader}>
                                <Avatar.Text
                                    size={32}
                                    label={getAvatarLabel(comment.author.username)}
                                    style={[
                                        styles.avatar,
                                        isOwnComment(comment) && styles.ownAvatar,
                                    ]}
                                />
                                <View style={styles.authorInfo}>
                                    <View style={styles.authorRow}>
                                        <Text
                                            variant="titleMedium"
                                            style={[
                                                styles.authorName,
                                                isOwnComment(comment) && styles.ownAuthorName,
                                            ]}
                                        >
                                            {comment.author.username}
                                            {isOwnComment(comment) && (
                                                <Text style={styles.youLabel}> (bạn)</Text>
                                            )}
                                        </Text>
                                        {isOwnComment(comment) && (
                                            <Menu
                                                visible={menuVisible === comment.id}
                                                onDismiss={() => setMenuVisible(null)}
                                                anchor={
                                                    <IconButton
                                                        icon="dots-vertical"
                                                        size={12}
                                                        onPress={() => setMenuVisible(comment.id)}
                                                    />
                                                }
                                            >
                                                <Menu.Item
                                                    onPress={() => handleEditComment(comment)}
                                                    title="Chỉnh sửa"
                                                    leadingIcon="pencil"
                                                />
                                                <Menu.Item
                                                    onPress={() => handleDeleteComment(comment.id)}
                                                    title="Xóa"
                                                    leadingIcon="delete"
                                                />
                                            </Menu>
                                        )}
                                    </View>
                                    <Text variant="bodySmall" style={styles.date}>
                                        {getDateDisplay(comment)}
                                    </Text>
                                </View>
                            </View>
                            {editingCommentId === comment.id ? (
                                <View style={styles.editContainer}>
                                    <TextInput
                                        value={editingText}
                                        onChangeText={setEditingText}
                                        multiline
                                        style={styles.editInput}
                                    />
                                    <View style={styles.editButtons}>
                                        <Button mode="outlined" onPress={handleCancelEdit}>
                                            Hủy
                                        </Button>
                                        <Button
                                            mode="contained"
                                            onPress={() => handleUpdateComment(comment.id)}
                                            loading={updateLoading}
                                            disabled={loading || !editingText.trim()}
                                            style={styles.editButton}
                                        >
                                            Lưu
                                        </Button>
                                    </View>
                                </View>
                            ) : (
                                <Text variant="bodyMedium" style={styles.commentContent}>
                                    {comment.content}
                                </Text>
                            )}
                        </Card.Content>
                    </Card>
                </Pressable>
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
        flex: 1,
    },
    date: {
        opacity: 0.6,
    },
    commentContent: {
        marginLeft: 44,
    },
    ownCommentCard: {
        backgroundColor: '#e3f2fd',
        borderLeftWidth: 3,
        borderLeftColor: '#2196f3',
    },
    ownAvatar: {
        backgroundColor: '#2196f3',
    },
    editContainer: {
        marginLeft: 44,
        gap: 8,
    },
    editInput: {
        backgroundColor: 'transparent',
    },
    editButtons: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-end',
    },
    editButton: {
        minWidth: 80,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ownAuthorName: {
        color: '#1976d2',
    },
    youLabel: {
        fontWeight: 'normal',
        fontSize: 12,
        color: '#666',
    },
});
