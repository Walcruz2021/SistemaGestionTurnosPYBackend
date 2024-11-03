//import Cliente from "../../models/cliente.js";
//import Perro from "../../models/perro.js";
import User from "../../models/user.js";
import Company from "../../models/company.js";
import Turno from "../../models/turno.js";
//import User from "../../models/user.js";

const resolvers = {
  Query: {
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
        const findUser = await User.findOne({ email }).populate("companies");

        if (findUser) {
          return findUser;
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.log(error);
      }
    },
    validationCompanyExist: async (_, { email }) => {
      try {
        const findUser = await User.findOne({ email: email }).populate(
          "companies",
          "nameCompany cuit"
        );
        if (findUser) {
          if (findUser.companies.length > 0) {
            return findUser.companies;
          } else {
            throw new Error("companies not found");
          }
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.log(error);
      }
    },
    getTurnos: async (_, { id }) => {
      const idCompany = id;

      try {
        const turnos = await Turno.find({ Company: idCompany });

        if (turnos.length > 0) {
          res.status(200).json({
            turnos,
          });
        } else {
          res.status(204).json({
            msg: "not found turnos",
          });
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  Mutation: {
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
    addUser: async (_, { fullName, status, email }) => {
      const newUser = new User({
        fullName,
        status,
        email,
      });

      const findUser = await User.findOne({ email: email });
      if (!findUser) {
        await newUser.save();
        return newUser;
      } else {
        throw new Error("User not found");
      }
    },
  },
};

export default resolvers;
