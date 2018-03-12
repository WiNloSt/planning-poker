import { fromEvent } from 'graphcool-lib'

export default async event => {
  try {
    console.log('voteCard resolver')
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { cardValue } = event.data

    const { Card } = await api.request(`
      query {
        Card(value: ${cardValue}) {
          id
        }
      }
    `)

    const { createVote } = await api.request(`
      mutation {
        createVote(cardId:"${Card.id}" ) {
          id
          card {
            _votesMeta {
              count
            }
          }
        } 
      }
    `)

    // force triggering Card subscription on relation changes
    api.request(`
      mutation {
        updateCard(id:"${Card.id}", dummy: "updated" ) {
          id
        } 
      }
    `)

    return {
      data: {
        id: createVote.id,
        count: createVote.card._votesMeta.count,
      },
    }
  } catch (e) {
    console.log(e)
    return {
      error: e.message,
    }
  }
}
