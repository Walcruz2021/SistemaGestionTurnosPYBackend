const Company = require("../models/company");
const User=require("../models/user")

const addCompany = async (req, res, next) => {
  const { nameCompany, address, cuit, province, country,emailUser} = req.body;
  console.log(emailUser)
  const newCompany = new Company({
    nameCompany,
    address,
    cuit,
    province,
    country,
  });
  const findUser=await User.findOne({email:emailUser})
  console.log(findUser)
  newCompany.seller=findUser
  await newCompany.save()
 
  if(findUser.companies){
    findUser.companies.push(newCompany)
    await findUser.save()
  }
  res.json({
    status: "company add successfully",
  });
};

const getCompany = async (req, res, next) => {
  try {
    if (req.params.id) {
        const findCompany = await Company.findById(req.params.id);
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

module.exports = {
  addCompany,
  getCompany
};
