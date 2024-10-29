import gql from "graphql-tag"

const Cliente=gql`
type cliente{
  name: String,
  phone: Number,
  address: String,
  notesCli: String,
  turnos: [Turno],
  pedidos: [Venta],
  perros: [Perro,
    nameDog: String
  ],
  status:Boolean,default:true,
  userLogin:Boolean,default:false,
  userName:String,
  Company:Company
}
`

export default Cliente