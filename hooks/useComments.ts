import { ADD_COMMENT, DELETE_COMMENT, UPDATE_COMMENT } from '@/services/graphql/mutations';
import { GET_COMMENTS } from '@/services/graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useNotification } from './useNotification';

const commentNotification = (() => {
    const { showSuccess, showError } = useNotification();
    
    return {showSuccess, showError}
})();

export function useComments(recipeId?: string) {
    const { data, loading, error } = useQuery(GET_COMMENTS, {
        variables: {
            id: recipeId,
        },
    });
    console.log(data);
    return { data: data?.recipeComments || [], loading, error };
}

export function useAddComment() {
    const [addComment, { loading, error }] = useMutation(ADD_COMMENT, {
        refetchQueries: [GET_COMMENTS],
        awaitRefetchQueries: true,
    });

    const submitComment = async (recipeId: string, content: string) => {
        console.log('Submitting comment:', { recipeId, content });
        try {
            const { data } = await addComment({
                variables: {
                    recipeId,
                    content,
                },
            });
            commentNotification.showSuccess('Thêm bình luận thành công!');
            return data.addComment;
        } catch (error) {
            console.error(error);
            commentNotification.showError('Thêm bình luận thất bại!');
            throw error;
        }
    };

    return {
        submitComment,
        loading,
        error,
    };
}

export function useUpdateComment() {
    const {showSuccess} = useNotification()
    const [updateComment, { loading, error }] = useMutation(UPDATE_COMMENT, {
        refetchQueries: [GET_COMMENTS],
        awaitRefetchQueries: true,
    });

    const submitComment = async (id: string, content: string) => {
        console.log('Update comment: ', { id, content });
        try {
            const { data } = await updateComment({
                variables: {
                    id,
                    content,
                },
            });
            showSuccess('Cập nhật bình luận thành công!');
            return data.updateComment;
        } catch (error) {
            console.error(error);
            commentNotification.showError('Cập nhật bình luận thất bại!');
            throw error;
        }
    };

    return {
        submitComment,
        loading,
        error,
    };
}
export function useDeleteComment() {
    
    const [deleteComment, { loading, error }] = useMutation(DELETE_COMMENT, {
        refetchQueries: [GET_COMMENTS],
        awaitRefetchQueries: true,
    });

    const submitDelete = async (id: string) => {
        try {
            const { data } = await deleteComment({
                variables: {
                    id,
                },
            });
            commentNotification.showSuccess('Xóa bình luận thành công!');
            return data.updateComment;
        } catch (error) {
            console.error(error);
            commentNotification.showError('Xóa bình luận thất bại!');
            throw error;
        }
    };

    return {
        submitDelete,
        loading,
        error,
    };
}
