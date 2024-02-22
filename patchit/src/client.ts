import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

const authLink = setContext((_, { header }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...header,
      authorization: token ? token : "",
    }
  }
})

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:5000/',
}));


const httpLink = new HttpLink({
  uri: 'http://localhost:5000/'
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});

export default client;
