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

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: (o: any) => o.id
});

export function provideClient() {
  return client;
}
