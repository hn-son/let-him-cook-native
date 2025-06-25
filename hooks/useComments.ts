import { ADD_COMMENT, UPDATE_COMMENT } from '@/services/graphql/mutations';
import { GET_COMMENTS } from '@/services/graphql/queries';
import { useMutation, useQuery } from '@apollo/client';

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

            return data.addComment;
        } catch (error) {
            console.error(error);
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

            return data.updateComment;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        submitComment,
        loading,
        error,
    }
}
