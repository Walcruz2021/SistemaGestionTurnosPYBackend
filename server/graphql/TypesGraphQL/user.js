import gql from "graphql-tag";
import Company from "../TypesGraphQL/company";
const User = gql`
  type User {
    fullName: String
    email: String
    companies: Company
    status: Boolean
  }
`;

export default User;
