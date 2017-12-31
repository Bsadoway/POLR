require('dotenv');
const yelp = require('yelp-fusion');
const yelp_api = process.env.YELP_API;
const client = yelp.client(yelp_api);

module.exports = {
  
  search: (url) => {
    return global.knex.select('id') .from('polls') .where({ 'poll_url': url }) .orWhere({ 'admin_url': url }) 
      .then(result => {
        return global.knex.raw(`SELECT poll_items.poll_item, polls.poll_title FROM poll_items JOIN polls ON polls.id=poll_items.poll_id WHERE poll_id='${result[0].id}' AND "irv_rank"=(SELECT MAX("irv_rank") FROM poll_items WHERE poll_id='${result[0].id}')`)
      })
      .then(result => {
        // console.log('result is:')
        // console.log(result.rows[0]);

        const pollTitle = result.rows[0].poll_title;
        const pollItem  = result.rows[0].poll_item;

        // console.log(pollTitle);
        // console.log(pollItem);


        const test = /eat|restaurant/.test(pollTitle);

        // if (test) {

          console.log('starting yelp search');
          // console.log('result is:')
          // console.log(result);

          const searchRequest = {
            term: pollItem,
            location: 'vancouver, bc'
          };

          return client.search(searchRequest)
            .then(result => {
              const firstResult = result.jsonBody.businesses[0];

              const name = result.jsonBody.businesses[0].name;
              const image = result.jsonBody.businesses[0].image_url;
              const yelp_url = result.jsonBody.businesses[0].url;
              const rating = result.jsonBody.businesses[0].rating;
              const price = result.jsonBody.businesses[0].price;

              const yelpObject = {
                name: name,
                image: image,
                yelp_url: yelp_url,
                rating: rating,
                price: price
              }

              const prettyJson = JSON.stringify(firstResult, null, 4);
              console.log(prettyJson);
              console.log('yelp object is')
              console.log(yelpObject)
              return yelpObject
            })
            .catch(error => {
              console.log('Error', error);
            });

      })

  
  }

}
