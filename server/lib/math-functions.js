module.exports = {

  generateRandomString: () => {
    return Math.random().toString(36).substr(2, 6);
  },

  listBuilder: (pollItems) => {
    const pollArray = [];
    let counter = 1;
    pollItems.forEach(item => {
      pollArray.push(`${counter})${item.poll_item}\n`);
      counter++;
    })
    return pollArray
  },

  randomSelect: () => {
    return Math.floor(Math.random() * 2);
  },

}