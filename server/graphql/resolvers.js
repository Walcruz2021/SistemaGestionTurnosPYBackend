//import Cliente from "../../models/cliente.js";
//import Perro from "../../models/perro.js";
import Company from "../../models/company.js";
import User from "../../models/user.js";
const resolvers = {
  Query: {
    hello: () => "Hello Walter",
    // getClients: async () => {
    //   const clients = await Cliente.find();
    //   return clients;
    // },
    getCompanyxId: async (_, { id }) => {
      try {
        if (id) {
          const findCompany = await Company.findById(id);
          if (findCompany) {
            return findCompany;
          } else {
            throw new Error("Company not found");
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    getUser: async () => {
      try {
        return;
      } catch (error) {
        console.log(error);
      }
    },
  },
  // Mutation: {
  //   createMascota: async (_, { nameDog, raza }) => {
  //     console.log(nameDog);
  //     const newPerro = new Perro({
  //       nameDog,
  //       raza,
  //     });
  //     const perroSaved = await newPerro.save();
  //     return perroSaved;
  //   },
  // },
};

export default resolvers;
