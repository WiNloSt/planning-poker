import React from 'react'
import { Router, Link } from 'react-static'
import styled, { injectGlobal } from 'styled-components'
import { hot } from 'react-hot-loader'
import Routes from 'react-static-routes'
import { ApolloProvider } from 'react-apollo'

import { client, createClient } from './client'

injectGlobal`
  body {
    font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial,
      'Lucida Grande', sans-serif;
    font-weight: 300;
    font-size: 24px;
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

class App extends React.Component {
  state = {
    client,
  }

  componentDidMount () {
    /* eslint-disable */
    this.setState({
      client: createClient()
    })
    /* eslint-enable */
  }

  render () {
    return (
      <Router>
        <ApolloProvider client={this.state.client}>
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
  }
}

export default hot(module)(App)
