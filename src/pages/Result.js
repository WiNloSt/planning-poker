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

const voteSubscription = gql`
  subscription updateCard {
    Card(filter: { mutation_in: [UPDATED] }) {
      node {
        id
        _votesMeta {
          count
        }
      }
    }
  }
`

const withMutation = graphql(
  gql`
    mutation {
      deleteVotes {
        count
      }
    }
  `,
  {
    props: props => ({
      ...props,
      subscribeToNewVotes: () =>
        props.ownProps.data.subscribeToMore({
          document: voteSubscription,
        }),
    }),
  }
)

export default compose(
  withQuery,
  withMutation,
  lifecycle({
    componentDidMount () {
      this.props.subscribeToNewVotes()
    },
  })
)(Component)
