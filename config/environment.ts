import Constants from 'expo-constants';

console.log('Constants.expoConfig', Constants.expoConfig);

export const environment = {
    graphqlUrl: Constants.expoConfig?.extra?.graphqlUrl,
    firebaseConfig: Constants.expoConfig?.extra?.firebaseConfig,
};
