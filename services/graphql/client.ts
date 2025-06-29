import { environment } from '@/config/environment';
import { useAuthStore } from '@/store/authStore';
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';



const testConnection = async () => {
    try {
        console.log('Check urlk: ', `${environment.graphqlUrl}/graphql`);
        const response = await fetch(`${environment.graphqlUrl}/graphql`, {
        // const response = await fetch(`https://8e7b-118-70-99-228.ngrok-free.app/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: '{__typename}'
            })
        })

        console.log('Connection test status: ', response.status)
        console.log('Connection test response: ', await response.text())

    } catch (error) {
        console.error('Connection test error: ', error)
    }
}

testConnection()

const httpLink = createHttpLink({
    // uri: 'http://localhost:4000/graphql', 
    // uri: 'http://192.168.1.68:4000/graphql', 
    uri: `${environment.graphqlUrl}/graphql`, 
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    }
});
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    console.log('=== GraphQL Error Debug ===');
    console.log('Operation:', operation.operationName);
    console.log('Variables:', operation.variables);
    
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    }
    
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
        console.log('Network error details:', JSON.stringify(networkError, null, 2));
        
        // Kiểm tra loại lỗi network
        if ('statusCode' in networkError) {
            console.log('Status Code:', networkError.statusCode);
        }
        if ('result' in networkError) {
            console.log('Result:', networkError.result);
        }
    }
    console.log('=== End Debug ===');
});

const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().token;

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        },
    };
});

export const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink ]),
    // link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
    },
});
