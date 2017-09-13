import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { environment } from '../environments/environment';

const wsClient = new SubscriptionClient(environment.graphcool.ws, {
  reconnect: true
});

const networkInterface = createNetworkInterface({
  uri: environment.graphcool.simple
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

networkInterfaceWithSubscriptions.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }

    const accessToken = localStorage.getItem('graphcool_token');
    const bearerToken = `Bearer ${localStorage.getItem('graphcool_token')}`;
    req.options.headers.authorization = accessToken ? bearerToken : null;

    next();
  }
}]);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: (o: any) => o.id
});

export function provideClient() {
  return client;
}
