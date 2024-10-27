import gql from "graphql-tag";

const Query = gql`
  type Query {
    hello: String
    getCompanyxId(id: ID!): Company
    getUser():User
  }
`;

export default Query;
