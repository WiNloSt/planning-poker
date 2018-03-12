import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { lifecycle } from 'recompose'
import * as R from 'ramda'

import { Button } from '../components/Buttons'

const Card = ({ card }) => (
  <div>
    {card.value}: {card._votesMeta.count}
  </div>
)

const formatDecimal = num => Math.round(num * 100) / 100

const Component = ({ data, mutate }) => {
  const { allCards } = data
  return (
    <React.Fragment>
      <h1>Result</h1>
      <div>
        {data.loading && !allCards ? (
          'loading...'
        ) : (
          <React.Fragment>
            {allCards.map(card => <Card key={card.id} card={card} />)}
            <hr />
            averge:{' '}
            {R.compose(
              formatDecimal,
              R.divide(R.__, R.compose(R.sum, R.map(card => card._votesMeta.count))(allCards)),
              R.sum,
              R.map(card => card.value * card._votesMeta.count)
            )(allCards) || 0}
          </React.Fragment>
        )}
      </div>
      <Button onClick={mutate}>Delete all votes</Button>
    </React.Fragment>
  )
}

const withQuery = graphql(
  gql`
    {
      allCards {
        id
        value
        _votesMeta {
          count
        }
      }
    }
  `,
  {
    options: {
      fetchPolicy: 'cache-and-network',
    },
  }
)

const withMutation = graphql(
  gql`
    mutation {
      deleteVotes {
        count
      }
    }
  `
)

const cardSubscription = gql`
  subscription updateCard {
    Card(filter: { mutation_in: [CREATED, UPDATED, DELETED] }) {
      node {
        id
        value
        _votesMeta {
          count
        }
      }
      mutation
      previousValues {
        id
      }
    }
  }
`

export default compose(
  withQuery,
  withMutation,
  lifecycle({
    componentDidMount () {
      this.props.data.subscribeToMore({
        document: cardSubscription,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev
          const data = subscriptionData.data
          if (!data.Card) return prev
          if (data.Card.mutation === 'CREATED') {
            return {
              allCards: prev.allCards.concat(data.Card.node),
            }
          }
          if (data.Card.mutation === 'DELETED') {
            return {
              allCards: prev.allCards.filter(card => card.id !== data.Card.previousValues.id),
            }
          }
          return prev
        },
      })
    },
  })
)(Component)
