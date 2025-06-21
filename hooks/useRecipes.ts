import { GET_RECIPE, GET_RECIPES } from '@/services/graphql/queries';
import { useQuery } from '@apollo/client';

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
        refetch
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
