export const typeDefs = `#graphql
    type Graph{
        title: String!
        clusters: [Cluster!]! @relationship(type: "CREATED", direction: IN)
    }
    
    type Cluster{
        name: String!
        keywords: [Keyword!]! @relationship(type: "BELONGS_TO", direction: IN)
    }

    type Keyword{
        name: String!
        count: Int!
        cluster: Cluster! @relationship(type: "BELONGS_TO", direction: OUT)
    }
`;