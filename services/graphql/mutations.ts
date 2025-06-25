import { gql } from '@apollo/client';

export const CREATE_RECIPE = gql`
    mutation CreateRecipe($input: RecipeInput!) {
        createRecipe(input: $input) {
            id
            title
            description
            ingredients {
                name
                quantity
                unit
            }
            steps
            author
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_RECIPE = gql`
    mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
        updateRecipe(id: $id, input: $input) {
            id
            title
            description
            ingredients
            steps
            imageUrl
            author
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_RECIPE = gql`
    mutation DeleteRecipe($id: ID!) {
        deleteRecipe(id: $id)
    }
`;

export const ADD_COMMENT = gql`
    mutation AddComment($recipeId: ID!, $content: String!) {
        addComment(recipeId: $recipeId, content: $content) {
            id
            content
            author {
                username
                id
                email
                role
            }
            createdAt
        }
    }
`;

export const UPDATE_COMMENT = gql`
    mutation UpdateComment($id: ID!, $content: String!) {
        updateComment(id: $id, content: $content) {
            id
            content
            author {
                username
                id
                email
                role
            }
            createdAt
            updatedAt
        }
    }
`;

export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            token
            user {
                id
                username
                email
                role
            }
        }
    }
`;

export const REGISTER = gql`
    mutation Register($input: RegisterInput!) {
        register(input: $input) {
            token
            user {
                id
                username
                email
                role
            }
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout {
            success
            message
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
            deletedId
            success
            message
            deleteBy
        }
    }
`;
