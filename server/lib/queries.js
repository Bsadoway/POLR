const math = require('./math-functions');
const sms = require('./sms');

module.exports = {

  // Voting and IRV Functions /////////////////////////////////
  // Checks if there are only two poll items left
  onlyTwoLeft: (id) => {
    return global.knex
      .count('poll_item')
      .from('poll_items')
      .where({ 'poll_id': id })
      .andWhere('rank', '>=', 0)
      .then(result => {
        if (result[0].count === 2) {
          return true
        } else {
          return false
        }
      })
  },

  // Checks if there is an item with > 50% of majority vote
  isWinner: (poll_id) => {
    return Promise.all([
      // Most votes
      global.knex.max('rank').from('poll_items').where({ 'poll_id': 3 }),
      // Total votes
      global.knex.sum('rank').from('poll_items').where({ 'poll_id': 3 })
    ])
      .then(result => {
        const mostVotes = result[0][0].max;
        const totalVotes = result[1][0].sum;
        const mostVoteRatio = mostVotes / totalVotes;
        console.log(mostVoteRatio);
        if (mostVoteRatio > 0.5) {
          return true
        } else {
          return false
        }
      })
  },

  // Calculates and sets rank according to submitted votes
  calculateRank: (url, columnSelector) => {
    return global.knex.raw(`SELECT poll_items.id, COUNT(submitted_rank) FROM poll_items JOIN polls ON poll_items.poll_id=polls.id JOIN submissions ON poll_items.id=submissions.item_id WHERE (poll_url='${url}' OR admin_url='${url}') AND submitted_rank=1 GROUP BY poll_items.id ORDER BY poll_items.id ASC`)
      .then(result => {
        if (columnSelector) {
          return Promise.all(result.rows.map(rankPoints => {
            return global.knex
              .from('poll_items')
              .where({ 'id': rankPoints.id })
              .update({ 'rank': rankPoints.count })
          }))
          // Sets IRV_rank after poll is closed 
        } else {
          return Promise.all(result.rows.map(rankPoints => {
            return global.knex
              .from('poll_items')
              .where({ 'id': rankPoints.id })
              .update({ 'IRV_rank': rankPoints.count })
          }))
        }
      });
  },

  // Runs one round of instant run-off
  instantRunOff: (url) => {
    // finds lowest IRV_ranked item in poll
    return global.knex
      .select('id')
      .from('polls')
      .where({ 'poll_url': url })
      .orWhere({ 'admin_url': url })
      .then(result => {
        return global.knex.raw(`SELECT poll_items.id FROM poll_items WHERE poll_id=${result[0].id} AND IRV_rank=(SELECT MIN(rank) FROM poll_items WHERE poll_id=${result[0].id})`)
      })
      // filters lowest IRV_ranked choice from future run offs
      .then(result => {
        // console.log('knex raw result')
        // console.log(result);
        return global.knex
          .from('poll_items')
          .where({ 'poll_items.id': result.rows[0].id })
          .update({ 'IRV_rank': null })
          .returning('id')//, 'submissions.voter_id')
      })
      // finds voters that voted for lowest ranked item as their first choice
      .then(result => {
        // console.log('returning result1 is')
        // console.log(result);
        return global.knex
          .select('voter_id', 'poll_id')
          .from('poll_items')
          .join('submissions', { 'poll_items.id': 'submissions.item_id' })
          .where({ 'item_id': result[0] })
          .andWhere({ 'submitted_rank': 1 })
      })
      // finds their 2nd ranked choice based on poll_id and voter_id
      .then(result => {
        if (result.length !== 0) {
          console.log('2nd choice result');
          console.log(result);
          return Promise.all(result.map(secondChoice => {
            return global.knex
              .select('poll_items.id', 'submitted_rank')
              .from('submissions')
              .join('poll_items', { 'submissions.item_id': 'poll_items.id' })
              .where({ 'poll_id': secondChoice.poll_id })
              .andWhere({ 'submitted_rank': 2 })
              .andWhere({ 'voter_id': secondChoice.voter_id })
              // adds 2nd place votes to the 2nd choice item
              .then(result => {
                return global.knex
                  .from('poll_items')
                  .where({ 'id': result[0].id })
                  .increment('IRV_rank', 1)
              })
          }));
        }
      })
  },


  // Other Query functions /////////////////////////////////////////////

  // Adds voter to database 'voters'
  addVoter: (sender) => {
    return global.knex
      .insert({
        phone_num: sender,
        name: 'anon'
      })
      .into('voters')
      .returning('id')
  },

  // Adds votes to poll item
  vote: (url, voteOrder, voter_id) => {
    console.log(voteOrder);
    const votes = voteOrder;
    // console.log(poll_identifier);
    const randomID = math.generateRandomString;
    return global.knex
      .select()
      .from('polls')
      .join('poll_items', { 'poll_items.poll_id': 'polls.id' })
      // .where({ 'polls.id': poll_identifier })
      .where({ 'poll_url': url })
      .orderBy('poll_items.id', 'asc')
      .then(result => {
        return Promise.all(votes.map((vote, index) => {
          return global.knex
            .insert({
              item_id: result[(vote - 1)].id,
              voter_id: voter_id,
              submitted_rank: (index + 1)
            })
            .into('submissions')
        }));
      })
  },

  // Checks if SMS sender is authorized to administer poll
  checkIfAdmin: (admin_url, sender) => {
    return global.knex
      .select()
      .from('polls')
      .where({ 'admin_url': admin_url })
      .andWhere({ 'creator': sender })
      .then(result => {
        if (result.length !== 0) {
          console.log('Success. Matched poll_id and sender');
          return module.exports.closePoll(admin_url)
        } else {
          console.log('Wrong poll id or unauthorized command');
          const responseMsg = "Invalid command";
          return
          // return sms.send(responseMsg);
        }
      })
  },

  closePoll: (admin_url) => {
    return global.knex
      .select('is_open')
      .from('polls')
      .where({ 'admin_url': admin_url })
      .update({
        is_open: false
      })
      .then(() => {
        return module.exports.calculateRank(admin_url, false)
      })
  },

  pollInsert: (poll_info, input) => {
    Promise.all(input.item.map((item) => {
      return global.knex
        .insert({
          poll_item: item,
          rank: 0,
          poll_id: poll_info[0].id
        })
        .into('poll_items')
        .returning('poll_item');
    }));
  }


}
