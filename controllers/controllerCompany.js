import Company from "../models/company.js";
import User from "../models/user.js";

//postman OK
//graphql OK
export const addCompany = async (req, res, next) => {
  const { nameCompany, address, cuit, province, country, emailUser } = req.body;
  console.log(emailUser)
  const newCompany = new Company({
    nameCompany,
    address,
    cuit,
    province,
    country,
  });
  const findUser = await User.findOne({ email: emailUser });
  if (findUser) {
    newCompany.seller = findUser;
    await newCompany.save();

    if (findUser.companies) {
      findUser.companies.push(newCompany);
      await findUser.save();
    }
    res.json({
      status: "company add successfully",
    });
  }else{
    res.status(204).json({
      "msg":"user not found"
    })
  }
};

//postman OK
//graphql OK
export const getCompanyXId = async (req, res, next) => {
  try {
    if (req.params.idCompany) {
      const findCompany = await Company.findById(req.params.idCompany);
      if (findCompany) {
        res.status(200).json({
          findCompany,
        });
      } else {
        res.status(204).json({
          msg: "no found company",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
