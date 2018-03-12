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

let link
if (process.env.REACT_STATIC_ENV === 'production') {
  link = httpLink
} else {
  const wsLink = new WebSocketLink({
    uri: 'wss://subscriptions.ap-northeast-1.graph.cool/v1/cjeml1rny28ak0169qoh19mx6',
    options: {
      reconnect: true,
    },
  })

  link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )
}

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
