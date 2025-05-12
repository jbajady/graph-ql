export const queruser={
    "query": `query {
 user{
 campus
  login
  attrs
  transactions (where:{type:{_eq:"xp"},event:{id:{_eq:41}}}) {
    amount
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

export const query={
    "query": `transactions (where:{type:{_eq:"xp"},event:{id:{_eq:41}}}) {
    amount

  object{
    name
  }
  }`
}