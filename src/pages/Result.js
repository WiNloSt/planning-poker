import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { lifecycle } from 'recompose'

const Card = ({ card }) => (
  <div>
    {card.value}: {card._votesMeta.count}
  </div>
)

const Component = ({ data, mutate }) => (
  <React.Fragment>
    <h1>Result</h1>
    <div>
      {data.loading ? 'loading...' : data.allCards.map(card => <Card key={card.id} card={card} />)}
    </div>
    <button onClick={mutate}>Delete all votes</button>
  </React.Fragment>
)

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
  `
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
          console.log(prev, subscriptionData)
          if (!subscriptionData.data) return prev
          const data = subscriptionData.data
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
