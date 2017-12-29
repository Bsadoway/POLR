const math = require('./math-functions')

module.exports = {

  findLowestRank: (url) => {
    return global.knex
      .select('id')
      .from('polls')
      .where({ 'poll_url': url })
      .orWhere({ 'admin_url': url })
      .then(result => {
        return global.knex.raw(`SELECT poll_items.id FROM poll_items WHERE poll_id='${result[0].id}' AND "irv_rank"=(SELECT MIN("irv_rank") FROM poll_items WHERE poll_id='${result[0].id}')`)
      })
  },

  eliminateItem: (poll_itemID) => {
    return global.knex
      .from('poll_items')
      .where({ 'poll_items.id': poll_itemID })
      .update({ 'irv_rank': null })
      .returning('id')
  },

  eliminateNoVotes: (url) => {
    return global.knex
      .select('poll_items.id')
      .from('poll_items')
      .join('polls', { 'polls.id': 'poll_items.poll_id' })
      .where(function () {
        this.where({ 'poll_url': url, })
          .orWhere({ 'admin_url': url, })
      })
      .andWhere({ 'irv_rank': 0 })
      .then(result => {
        console.log(result);
        return Promise.all(result.map(poll_item => {
          console.log(poll_item)
          return global.knex
            .from('poll_items')
            .where({ 'id': poll_item.id })
            .update({ 'irv_rank': null })
        }))
      })
  },

  findVoter: (poll_itemId) => {
    return global.knex
      .select('voter_id', 'poll_id')
      .from('poll_items')
      .join('submissions', { 'poll_items.id': 'submissions.item_id' })
      .where({ 'item_id': poll_itemId[0] })
      .andWhere({ 'submitted_rank': 1 })
  },

  updateRank: (result) => {
    return global.knex
      .from('poll_items')
      .where({ 'id': result.id })
      .increment('irv_rank', 1)
  },

  // Find their next highest ranked poll item that's still in the running
  findNextBestChoice(submitted_rank, poll_id, voter_id) {
    return global.knex
      .select('poll_items.id', 'submitted_rank', 'rank')
      .from('submissions')
      .join('poll_items', { 'submissions.item_id': 'poll_items.id' })
      .where({ 'poll_id': poll_id })
      .andWhere({ 'submitted_rank': submitted_rank })
      .andWhere({ 'voter_id': voter_id })
      .then(result => {
        console.log(result);
        if (result.length !== 0 && result[0].rank !== null) {
          return result[0]
        } else {
          console.log('hit else statement');
          return module.exports.findNextBestChoice((submitted_rank + 1), poll_id, voter_id)
        }
      })
  },

  // Checks if there is an item with > 50% of majority vote
  isWinner: (url) => {
    return Promise.all([
      global.knex.max('irv_rank').from('poll_items').join('polls', { 'poll_items.poll_id': 'polls.id' }).where({ 'poll_url': url }).orWhere({ 'admin_url': url }),
      global.knex.sum('irv_rank').from('poll_items').join('polls', { 'poll_items.poll_id': 'polls.id' }).where({ 'poll_url': url }).orWhere({ 'admin_url': url })
    ])
      .then(votes => {
        return math.hasMajorityVote(votes)
      })
  },

  // Checks if there are only two poll items left
  onlyTwoLeft: (url) => {
    return global.knex
      .count('poll_item')
      .from('poll_items')
      .join('polls', { 'poll_items.poll_id': 'polls.id' })
      .where(function () {
        this.where({ 'poll_url': url, })
          .orWhere({ 'admin_url': url, })
      })
      .andWhere('irv_rank', '>=', 0)
      .then(result => {
        console.log("only 2 left results");
        console.log(result);
        if (result[0].count === '2') {
          console.log('true')
          return true
        } else {
          console.log('false')
          return false
        }
      })
  },
}
