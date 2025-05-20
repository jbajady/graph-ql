export const queruser={
    "query": `query {
           transaction(
        where: {type: { _like: "skill%" }}
       order_by: [{type: asc}, {createdAt: desc}]
        distinct_on: type
         ) {
             type
             amount
    }
 user{

    auditRatio
    totalUp
        totalUpBonus
        totalDown
       
 events(where:{event: {object:{type:{_eq: "module"}}}}) {
  
    level
  xp{
    amount
  }
  }
 campus
  login
  attrs
  transactions (where:{type:{_eq:"xp"},event:{id:{_eq:41}}}) {
    amount
     createdAt
  object{
    name
  }
  }
      # Grades from 'progress' table
    progresses(where: {
      object: { type: { _eq: "project" } }
    }) {
      grade
      createdAt
      object {
        name
      }
    }
}
}`
}   

// export const query={
//     "query": `transactions (where:{type:{_eq:"xp"},event:{id:{_eq:41}}}) {
//     amount

//   object{
//     name
//   }
//   }`
// }

// let response = await Fetche(`{
//   user {
//       login
//       attrs
//       auditRatio
//       totalUp
//       totalDown
//       transactions (where:{type:{_eq:"xp"} ,event:{id:{_eq:41}}}) {
//           amount
//       }
//   }
// })
// result (where :{object:{type:{_eq:"project"}} }){
//        object{
//           name
//           type
//        }
//       grade
//   }
// })
// const query =  {
//   transaction(
//   where: {type: { like: "skill%" }}
//  order_by: [{type: asc}, {createdAt: desc}]
//   distinct_on: type
//    ) {
//        type
//        amount
// }
// }`)