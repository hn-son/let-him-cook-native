import { gql } from '@apollo/client';

export const GET_RECIPES = gql`
    query GetRecipes($search: String, $limit: Int, $offset: Int, $authorId: String) {
        recipes(search: $search, limit: $limit, offset: $offset, authorId: $authorId) {
            id
            title
            description
            cookingTime
            difficulty
            createdAt
            imageUrl
            ingredients {
                name
                quantity
                unit
            }
            author {
                id
                username
            }
        }
    }
`;

export const GET_RECIPE = gql`
    query GetRecipe($id: ID!) {
        recipe(id: $id) {
            id
            title
            description
            cookingTime
            difficulty
            imageUrl
            createdAt
            ingredients {
                name
                quantity
                unit
            }
            author {
                username
            }
            steps
        }
    }
`;


export const GET_COMMENTS = gql`
    query GetComments($id: ID!) {
        recipeComments(recipeId: $id) {
            id
            content
            createdAt
            updatedAt
            author {
                id
                username
            }
        }
    }
`