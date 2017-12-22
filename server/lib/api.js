// module.exports = function ghj(knex) {

//   return {

//     getEverything: () =>  {
//       console.log('hi hello');
//       // console.log(knex);
//       return knex
//         .select()
//         .from('polls')
//         .then((results) => {
//           console.log(results);
//         });
//      // }
//    }
//   }


// }






module.exports = {

  getEverything: () => {
    return global.knex
    .select()
    .from('polls')
  }

}


// function userAccessControl (userId) {
//   return this.where('userId', '=', userId)
// }
