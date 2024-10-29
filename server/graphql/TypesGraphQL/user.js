import gql from "graphql-tag";

const User = gql`
  type User {
    id:ID
    fullName: String
    email: String
    status: Boolean
    companies:[Company]
  }
`;

export default User;
