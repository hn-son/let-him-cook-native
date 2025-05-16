import { useAuthStore } from '@/store/authStore';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql', // Thay thế bằng endpoint thực tế
});

const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().token

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
