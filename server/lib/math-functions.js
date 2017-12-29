module.exports = {

  generateRandomString: () => {
    return Math.random().toString(36).substr(2, 6);
  },

  listBuilder: (pollItems) => {
    const pollArray = [];
    let counter = 1;
    pollItems.forEach(item => {
      pollArray.push(`${counter}. ${item.poll_item}\n`);
      counter++;
    })
    return pollArray
  },

  randomSelect: (n) => {
    return Math.floor(Math.random() * n)
  },

  hasMajorityVote: (votes) => {
    const mostVotes = votes[0][0].max;
    const totalVotes = votes[1][0].sum;
    const mostVoteRatio = mostVotes / totalVotes;
    console.log(mostVoteRatio);
    if (mostVoteRatio > 0.5) {
      console.log('there is a winner')
      return true
    } else {
      console.log('there is no winner')
      return false
    }
  }

}
