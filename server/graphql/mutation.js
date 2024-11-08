import gql from "graphql-tag";

const Mutation = gql`
  type Mutation {
    """
    Create a company for the user who was passed via email
    """
    addCompany(
      nameCompany: String
      address: String
      cuit: String
      province: String
      country: String
      emailUser: String
    ): Company

    """
    Create a User. This request is aplicated in Register User
    """
    addUser(fullName: String, status: Boolean, email: String): User

    """
    Create a client for the veterinary clinic or hair salon
    """
    addClient(
      name: String
      phone: String
      address: String
      notesCli: String
      status: Boolean
      Company: String
    ): Cliente
  }
`;

export default Mutation;
