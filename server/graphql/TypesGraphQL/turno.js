import gql from "graphql-tag";
import { GraphQLDateTime } from "graphql-scalars";
const Turno = gql`
  """
  Client's Turns
  """
  scalar Date
  scalar Time
  type Turno {
    name: String
    nameDog: String
    idDog: String
    phone: Float
    date: Date
    notesTurn: String
    time: Time
    #   //(sellers)nombre de campo el cual contendra no solo el id del cliente sino ademas todos
    #   //los datos del mismo(pedidos,turnos,etc)
    Client: String
    Company: String
  }
`;
export default Turno;
