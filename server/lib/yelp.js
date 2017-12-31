require('dotenv');
const yelp = require('yelp-fusion');
const yelp_api = process.env.YELP_API;
const client = yelp.client(yelp_api);

module.exports = {
  
  search: (url) => {
    return global.knex
      .select('id')
      .from('polls')
      .where({ 'poll_url': url })
      .orWhere({ 'admin_url': url })
      .then(result => {
        return global.knex.raw(`SELECT poll_items.poll_item FROM poll_items WHERE poll_id='${result[0].id}' AND "irv_rank"=(SELECT MIN("irv_rank") FROM poll_items WHERE poll_id='${result[0].id}')`)
      })
      .then(restaurant => {

        const test = /eat|restaurant/.test(restaurant.poll_title);

        if (test) {

          console.log('starting yelp search');
          console.log('result is:')
          console.log(restaurant);

          const searchRequest = {
            term: restaurant.poll_title,
            location: 'vancouver, bc'
          };

          return client.search(searchRequest)
            .then(result => {
              const firstResult = result.jsonBody.businesses[0].id;
              // const prettyJson = JSON.stringify(firstResult, null, 4);
              // console.log(prettyJson);
              return firstResult
            })
            .then(() => {
              return client.business("richmond-sushi-richmond")
                .then(result => {
                  const firstResult = result.jsonBody;
                  const prettyJson = JSON.stringify(firstResult, null, 4);
                  // console.log("SECOND ONE")
                  console.log(prettyJson);
                  return firstResult
                })
            })
            .catch(error => {
              console.log('Error', error);
            });

        } else {
          console.log("not a match. no yelp search");
          return
        }





      })

  
  }

}


/* 
Details:

.name:
.image_url
.url - yelp url
.phone
.rating

.location.address1
          .city
          .state

          .display_address[0] - the whole thing
.photos[array of photos]
.price


*/