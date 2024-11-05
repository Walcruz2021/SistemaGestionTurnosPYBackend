import gql from "graphql-tag";

const Cliente = gql`
type Cliente{
  id:ID
  name: String,
  phone: Float,
  address: String,
  notesCli: String,
  turnos: [Turno],
  # pedidos: [Venta],
  # perros: [Perro,
  #   nameDog: String
  # ],
  status:Boolean,
  userLogin:Boolean,
  userName:String,
  company:Company
}
`;

export default Cliente;
