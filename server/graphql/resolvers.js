//import Cliente from "../../models/cliente.js";
//import Perro from "../../models/perro.js";
import User from "../../models/user.js";
import Company from "../../models/company.js";

//import User from "../../models/user.js";

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
    searchUser: async (_, { email }) => {
      try {
        const findUser = await User.findOne({ email}).populate('companies');

        if (findUser) {
          return findUser;
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.log(error);
      }
    },
    validationCompanyExist:async(_,{email})=>{
      try {
        const findUser = await User.findOne({ email: email }).populate(
          "companies",
          "nameCompany cuit"
        );
        if (findUser) {
          if (findUser.companies.length > 0) {
            
            return findUser.companies
          } else {
            throw new Error("companies not found")
          }
        } else {
        throw new Error("User not found")
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  Mutation: {
    // createMascota: async (_, { nameDog, raza }) => {
    //   console.log(nameDog);
    //   const newPerro = new Perro({
    //     nameDog,
    //     raza,
    //   });
    //   const perroSaved = await newPerro.save();
    //   return perroSaved;
    // },
    addCompany: async (
      _,
      { nameCompany, address, cuit, province, country, emailUser }
    ) => {
      const findUser = await User.findOne({ email: emailUser });
      if (findUser) {
        const newCompany = new Company({
          nameCompany,
          address,
          cuit,
          province,
          country,
        });
        newCompany.seller = findUser;
        await newCompany.save();

        if (findUser.companies) {
          findUser.companies.push(newCompany);
          await findUser.save();
        }
        return newCompany;
      }
    },
  },
};

export default resolvers;
