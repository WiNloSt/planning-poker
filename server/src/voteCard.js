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
        value
        count
      }
    }
    `)

    return api.request(`
    mutation {
      data: updateCard(id: "${Card.id}", count: ${Card.count + 1}) {
        id
        value
        count
      }
    }
    `)
  } catch (e) {
    console.log(e)
    return {
      error: e.message,
    }
  }
}
