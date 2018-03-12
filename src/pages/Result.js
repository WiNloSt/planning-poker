import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

const Card = ({ card }) => (
  <div>
    {card.value}: {card._votesMeta.count}
  </div>
)

const Component = ({ data: { loading, allCards }, mutate }) => (
  <React.Fragment>
    {console.log(mutate)}
    <h1>Result</h1>
    <div>{loading ? 'loading...' : allCards.map(card => <Card key={card.id} card={card} />)}</div>
    <button onClick={mutate}>Delete all votes</button>
  </React.Fragment>
)

const withQuery = graphql(gql`
  {
    allCards {
      id
      value
      _votesMeta {
        count
      }
    }
  }
`)

const withMutation = graphql(
  gql`
    mutation {
      deleteVotes {
        count
      }
    }
  `
)

export default compose(withQuery, withMutation)(Component)
