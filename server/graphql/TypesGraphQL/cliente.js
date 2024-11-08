import gql from "graphql-tag";

const Cliente = gql`
  """
  Company Clients
  """
  type Cliente {
    id: ID
    name: String
    phone: String
    address: String
    notesCli: String
    turnos: [String]
    pedidos: [String]
    perros: [String]
    status: Boolean
    userLogin: Boolean
    userName: String
    Company: String
  }
`;

export default Cliente;
