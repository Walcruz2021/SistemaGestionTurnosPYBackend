import gql from "graphql-tag";

const Mutation = gql`
  type Mutation {
    addCompany(
      nameCompany: String
      address: String
      cuit: String
      province: String
      country: String
      emailUser: String
    ): Company
    addUser(fullName: String, status: Boolean, email: String): User
  }
`;

export default Mutation;
