import gql from "graphql-tag";

const Gastos = gql`
type gastos{
  anio: Number,
  date: String,
  description:String,
  efectivo: Number,
  transferencia : Number,
  tarjeta : Number,
  categoryGasto:String,
  value:Number,
  mes: Number,
  typeGasto:String,
  idCompany:Company
  }
}
`;

export default Gastos;
