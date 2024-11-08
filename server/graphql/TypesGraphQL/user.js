import gql from "graphql-tag";

const User = gql`
  """
  User Loged Customer PymesYa
  """
  type User {
    id: ID
    fullName: String
    email: String
    status: Boolean
    companies: [Company]
  }
`;

export default User;
