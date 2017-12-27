module.exports = {

  generateRandomString: () => {
    return Math.random().toString(36).substr(2, 6);
  },

  listBuilder: (pollItems) => {
    const pollArray = [];
    let counter = 1;
    pollItems.forEach(item => {
      pollArray.push(`${counter}.${item.poll_item}`);
      counter++;
    })
    return pollArray
  },

  // Sets current rank in submitted poll_id based on submitted first choice votes
  calculateRank: (id) => {
    return global.knex
      .select('poll_items.id')
      .count('submitted_rank')
      .from('submissions')
      .join('poll_items', { 'submissions.item_id': 'poll_items.id' })
      .where({ 'poll_id': id })
      .andWhere({ 'submitted_rank': 1 })
      .groupBy('poll_items.id')
      .then(result => {
        return Promise.all(result.map(rankPoints => {
          return global.knex
            .from('poll_items')
            .where({ 'id': rankPoints.id })
            .update({ 'rank': rankPoints.count })
          // .increment('rank', rankPoints.count)
        }))
      });
  },

  instantRunOff: (id) => {
    // finds lowest ranked item in poll
    return global.knex.raw(`SELECT id FROM poll_items WHERE poll_id=${id} AND rank=(SELECT MIN(rank) FROM poll_items WHERE poll_id=${id})`)
      // filters lowest ranked choice from future run offs
      .then(result => {
        console.log('knex raw result')
        console.log(result);
        return global.knex
          .from('poll_items')
          .where({ 'poll_items.id': result.rows[0].id })
          .update({ 'rank': null })
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
                    .increment('rank', 1)
              })
          }));
      }
    })
  }





}