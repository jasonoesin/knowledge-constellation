export const typeDefs = `#graphql
    type Graph{
        title: String!
        clusters: [Cluster!]! @relationship(type: "BELONGS_TO", direction: IN)
    }
    
    type Cluster{
        name: String!
        keywords: [Keyword!]! @relationship(type: "BELONGS_TO", direction: IN)
        graph: Graph! @relationship(type: "BELONGS_TO", direction: OUT)
    }

    type Keyword{
        name: String!
        count: Int!
        cluster: Cluster! @relationship(type: "BELONGS_TO", direction: OUT)
    }
`;