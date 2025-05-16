import { useAddComment } from "@/hooks/useComments";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface CommentSectionProps {
  comments: Comment[];
  recipeId: string;
  isAuthenticated: boolean;
  onCommentPress: () => void;
}

export default function CommentSection({ 
  comments, 
  recipeId, 
  isAuthenticated,
  onCommentPress 
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const { submitComment, loading } = useAddComment();

  const handleAddComment = async () => {
    if (commentText.trim()) {
      await submitComment('',commentText);
      setCommentText("");
    }
  };

  return (
    <View style={styles.container}>
      {comments.map((comment) => (
        <Card key={comment.id} style={styles.commentCard}>
          <Card.Content>
            <Text variant="titleMedium">{comment.user.name}</Text>
            <Text variant="bodyMedium">{comment.text}</Text>
            <Text variant="bodySmall" style={styles.date}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>
      ))}

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
        <Button mode="contained" onPress={onCommentPress}>
          Đăng nhập để bình luận
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  commentCard: {
    marginBottom: 8,
  },
  date: {
    marginTop: 4,
    opacity: 0.6,
  },
  inputContainer: {
    marginTop: 16,
    gap: 8,
  },
  input: {
    backgroundColor: "transparent",
  },
});
