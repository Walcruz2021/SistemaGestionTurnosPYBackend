import gql from "graphql-tag";

const Perro = gql`
"""Customer's Pet"""
type Perro{
  raza: String,
  tamaño: String,
  nameDog: String,
  notaP: String,
  status:Boolean
}
`;

export default Perro;
