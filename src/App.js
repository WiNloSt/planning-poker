import React from 'react'
import { Router, Link } from 'react-static'
import styled, { injectGlobal } from 'styled-components'
import { hot } from 'react-hot-loader'
import Routes from 'react-static-routes'
import fetch from 'node-fetch'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

injectGlobal`
  body {
    font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial,
      'Lucida Grande', sans-serif;
    font-weight: 300;
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
`

const AppStyles = styled.div`
  a {
    text-decoration: none;
    color: #108db8;
    font-weight: bold;
  }

  nav {
    width: 100%;
    background: #108db8;

    a {
      color: white;
      padding: 1rem;
      display: inline-block;
    }
  }

  .content {
    padding: 1rem;
  }

  img {
    max-width: 100%;
  }
`
const httpLink = new HttpLink({
  fetch,
  uri: 'https://api.graph.cool/simple/v1/cjeml1rny28ak0169qoh19mx6',
})

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

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

const App = () => (
  <Router>
    <ApolloProvider client={client}>
      <AppStyles>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/result">Result</Link>
        </nav>
        <div className="content">
          <Routes />
        </div>
      </AppStyles>
    </ApolloProvider>
  </Router>
)

export default hot(module)(App)
