import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import fetch from 'isomorphic-unfetch';

// const { HttpLink } = apolloLinkHttp;
// const { ApolloLink } = apolloLink;
// const { onError } = apolloLinkError;

const { log } = console;

export default (req) => {
  const headers = req ? req.headers : {};
  const uri = (req) ? `${req.protocol}://${req.get('host')}` : '';

  return {
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) => log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
        }
        if (networkError) log(`[Network error]: ${networkError}`);
      }),
      new HttpLink({
        uri: `${uri}/graphql`,
        headers,
        fetch,
      }),
    ]),
  };
};
