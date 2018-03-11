import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const Component = ({ data: { loading, hello } }) => (
  <React.Fragment>
    <h1>Result</h1>
    <div>{loading ? 'loading...' : hello.message}</div>
  </React.Fragment>
)

const withQuery = graphql(gql`
  {
    hello {
      message
    }
  }
`)

export default withQuery(Component)
