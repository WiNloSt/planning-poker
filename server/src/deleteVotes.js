import { fromEvent } from 'graphcool-lib'

export default async event => {
  try {
    console.log('deleteVotes resolver')
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { allVotes } = await api.request(`
      {
        allVotes {
          id
        }
      }
    `)

    await Promise.all(
      allVotes.map(vote =>
        api.request(`
        mutation {
          deleteVote(id: "${vote.id}") {
            id
          }
        }
      `)
      )
    )

    return {
      data: {
        count: allVotes.length,
      },
    }
  } catch (e) {
    console.log(e)
    return {
      error: e.message,
    }
  }
}
