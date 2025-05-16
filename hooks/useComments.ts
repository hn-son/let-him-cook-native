import { ADD_COMMENT } from '@/services/graphql/mutations';
import { GET_COMMENTS } from '@/services/graphql/queries';
import { useMutation, useQuery } from '@apollo/client';

export function useComments(recipeId?: string) {
    const { data, loading, error } = useQuery(GET_COMMENTS, {
        variables: {
            id: recipeId,
        },
    });
    return { data, loading, error };
}

export function useAddComment() {
    const [addComment, { loading, error }] = useMutation(ADD_COMMENT, {
        refetchQueries: [GET_COMMENTS],
        awaitRefetchQueries: true,
    });

    const submitComment = async (recipeId: string, content: string) => {
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
