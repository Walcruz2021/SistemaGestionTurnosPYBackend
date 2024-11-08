import gql from "graphql-tag";

const Venta = gql`
  """
  Company Sales
  """
  type venta {
    date: String
    anio: Number
    mes: Number
    idTurno: Turnos
    name: String
    Dog: Perro
    notesTurn: String
    tipoServ: String
    valorServ: Number
    client: Cliente
    efectivo: Number
    transferencia: Number
    tarjeta: Number
    idCompany: Company
  }
`;

export default Venta;
