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
  }

}
