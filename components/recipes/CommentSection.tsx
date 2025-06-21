import { useAddComment, useComments } from "@/hooks/useComments";
import { formatDate } from "@/utils";
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
  recipeId: string;
  isAuthenticated: boolean;
  onCommentPress: () => void;
}

export default function CommentSection({
  recipeId, 
  isAuthenticated,
  onCommentPress 
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const { submitComment, loading } = useAddComment();
  const {data: comments, loading: commentLoading, error: commentError} = useComments(recipeId);
  console.log("Comments data: ", comments);

  const handleAddComment = async () => {
    if (commentText.trim()) {
      await submitComment('',commentText);
      setCommentText("");
    }
  };

  return (
    <View style={styles.container}>
      {comments?.map((comment) => (
        <Card key={comment.id} style={styles.commentCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.authorName}>{comment.author.username}</Text>
            <Text variant="bodyMedium">{comment.content}</Text>
            <Text variant="bodySmall" style={styles.date}>
              {formatDate(comment.createdAt)}
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
  authorName: {
    fontWeight: "bold",
    marginBottom: 4,
  }
});
