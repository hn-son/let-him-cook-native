import { CREATE_RECIPE, UPDATE_RECIPE } from '@/services/graphql/mutations';
import { GET_RECIPE, GET_RECIPES } from '@/services/graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useNotification } from './useNotification';

export function useRecipes(search?: string) {
    const { data, loading, error, refetch } = useQuery(GET_RECIPES, {
        variables: {
            search,
        },
        fetchPolicy: 'cache-and-network',
    });

    return {
        recipes: data?.recipes || [],
        loading,
        error,
        refetch,
    };
}

export function useRecipeDetails(id: string) {
    const { data, loading, error } = useQuery(GET_RECIPE, {
        variables: {
            id,
        },
        fetchPolicy: 'cache-and-network',
    });

    return {
        recipe: data?.recipe,
        loading,
        error,
    };
}

export function useAddRecipe() {
    const [addRecipe, { loading, error }] = useMutation(CREATE_RECIPE);

    const { showSuccess, showError } = useNotification();

    const submitRecipe = async (recipe: any) => {
        try {
            const { data } = await addRecipe({
                variables: {
                    input: recipe,
                },
            });
            showSuccess('Thêm công thức thành công!');
            return data.createRecipe;
        } catch (error) {
            console.error(error);
            showError('Thêm công thức thất bại! Hãy thử loại hoặc liên hệ với nhà phát triển');
        }
    };

    return {
        submitRecipe,
        loading,
        error,
    };
}

export function useUpdateRecipe() {
    const [updateRecipe, {loading, error}] = useMutation(UPDATE_RECIPE)
    const { showSuccess, showError } = useNotification();

    const submitRecipe = async (id: string, recipe: any) => {
        try {
            const result = await updateRecipe({
                variables: {
                    id,
                    input: recipe,
                },
            });
            showSuccess('Cập nhật công thức thành công!');
            return result.data.updateRecipe;
        } catch (error) {
            console.error(error)
            showError('Cập nhật công thức thất bại! Hãy thử loại hoặc liên hệ với nhà phát triển');
        }
    }

    return {
        submitRecipe,
        loading,
        error,
    }
}
