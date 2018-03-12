import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const Card = ({ card }) => (
  <div>
    {card.value}: {card._votesMeta.count}
  </div>
)

const Component = ({ data: { loading, allCards } }) => (
  <React.Fragment>
    <h1>Result</h1>
    <div>{loading ? 'loading...' : allCards.map(card => <Card key={card.id} card={card} />)}</div>
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

export default withQuery(Component)
