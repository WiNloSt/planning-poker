import fetch from 'node-fetch'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = new HttpLink({
  fetch,
  uri: 'https://api.graph.cool/simple/v1/cjeml1rny28ak0169qoh19mx6',
})

export const createClient = () => {
  const wsLink = new WebSocketLink({
    uri: 'wss://subscriptions.ap-northeast-1.graph.cool/v1/cjeml1rny28ak0169qoh19mx6',
    options: {
      reconnect: true,
    },
  })

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  })
}

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
