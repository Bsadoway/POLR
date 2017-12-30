const math = require('./math-functions');
const sms = require('./sms');
const irv = require('./irv')

module.exports = {

  // Voting and IRV Functions /////////////////////////////////

  // Checks if there is an item with > 50% of majority vote
  isWinner: (url) => {
    return Promise.all([
      // Most votes
      global.knex.max('irv_rank').from('poll_items').join('polls', { 'poll_items.poll_id': 'polls.id' }).where({ 'poll_url': url }).orWhere({ 'admin_url': url }),
      // Total votes
      global.knex.sum('irv_rank').from('poll_items').join('polls', { 'poll_items.poll_id': 'polls.id' }).where({ 'poll_url': url }).orWhere({ 'admin_url': url })
    ])
      .then(votes => {
        return math.hasMajorityVote(votes)
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
              .update({ 'irv_rank': rankPoints.count })
          }))
        }
      });
  },

  instantRunOff: (url) => {
    return irv.findLowestRank(url)
      .then(poll_itemID => {
        const itemQty = poll_itemID.rows.length;
        const selector = math.randomSelect(itemQty);
        const poll_item_id = poll_itemID.rows[selector].id;
        return irv.eliminateItem(poll_item_id)
      })
      .then(poll_itemId => {
        return irv.findVoter(poll_itemId)
      })
      .then(result => {
        // console.log('next best choie');
        return Promise.all(result.map(nextChoice => {
          return irv.findNextBestChoice(2, nextChoice.poll_id, nextChoice.voter_id)
            .then(result => {
              return irv.updateRank(result)
            })
        }));
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
      .update({ is_open: false })
      .then(() => {
        return module.exports.calculateRank(admin_url, false)
      })
      .then(() => {
        return irv.eliminateNoVotes(admin_url)
      })
  },

  pollInsert: (poll_info, input) => {
    return Promise.all(input.item.map((item) => {
      return global.knex
        .insert({
          poll_item: item,
          rank: 0,
          poll_id: poll_info[0].id
        })
        .into('poll_items')
        .returning('poll_item');
    }))
    .then(() =>{
      return poll_info
    })
  }


}
