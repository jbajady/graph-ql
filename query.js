export const queruser = {
  query: `query {
    transaction(
      where: { type: { _like: "skill%" } }
      order_by: [{ type: asc }, { createdAt: desc }]
      distinct_on: type
    ) {
      type
      amount
    }

    user {
      auditRatio
      totalUp
      totalUpBonus
      totalDown
      campus
      login
      attrs

      events(where: { event: { object: { type: { _eq: "module" } } } }) {
        level
        xp {
          amount
        }
      }

      transactions(
        where: {
          type: { _eq: "xp" },
          event: { id: { _eq: 41 } }
        }
      ) {
        amount
        createdAt
        object {
          name
        }
      }
    }
  }`
};
