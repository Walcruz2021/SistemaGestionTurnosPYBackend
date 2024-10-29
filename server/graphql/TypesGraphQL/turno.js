import gql from "graphql-tag"

const Turno=gql`
type turno{
    name: String,
  nameDog: String, ,
  idDog: String,
  phone: Number,
  date:String,
  notesTurn:String,
  time: String,
#   //(sellers)nombre de campo el cual contendra no solo el id del cliente sino ademas todos
#   //los datos del mismo(pedidos,turnos,etc)
  Client: Cliente,
  Company: Company
}
`
export default Turno