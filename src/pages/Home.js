import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'

const Button = styled.button`
  height: 3rem;
  width: 5rem;
  margin-right: 2rem;
`

const Card = ({ card, onClick }) => <Button onClick={onClick}>{card.value}</Button>

const Component = ({ allCards, voteCard }) => (
  <div>
    {allCards.loading
      ? 'loading...'
      : allCards.allCards.map(card => (
        <Card
          key={card.id}
          card={card}
          onClick={() => {
            voteCard({ variables: { cardValue: card.value } })
          }}
        />
      ))}
  </div>
)

const withAllCards = graphql(
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
    name: 'allCards',
  }
)

const withVoteCard = graphql(
  gql`
    mutation voteCard($cardValue: Int!) {
      voteCard(cardValue: $cardValue) {
        id
      }
    }
  `,
  { name: 'voteCard' }
)

export default compose(withAllCards, withVoteCard)(Component)
