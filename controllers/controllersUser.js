import User from "../models/user.js";
//graphQL OK
//postman OK
//lo tengo con fullname y email averiguar si ademas se mle debe agregar otros datos como companies
export const addUser = async (req, res) => {
  const { fullName, status, email } = req.body;
  console.log(fullName)
  const newUser = new User({
    fullName,
    status,
    email,
  });

  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    console.log("user NO se encontro");
    await newUser.save();
    return res.status(200).json({
      msg: "user add correctly",
      newUser,
    });
  } else {
    return res.status(204).json({
      "msg": "user NOT added",
    });
  }
};

//postman OK graphQl ok
export const validationCompanyExist = async (req, res) => {
  const email = req.params.email;

  try {
    const findUser = await User.findOne({ email: email }).populate(
      "companies",
      "nameCompany cuit address province country"
    );
    //const findUser = await User.findOne({ email: email });
    if (findUser) {
      if (findUser.companies.length > 0) {
        res.status(200).json({
          companies: findUser.companies,
        });
   
      } else {
        res.status(204).json({
          msg: "Companies not found",
        });
      }
    } else {
      res.status(205).json({
        msg: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//postman OK
//graphQL OK
export const searchUser = async (req, res) => {
  const email = req.params.email;

  try {
    const findUser = await User.findOne({ email: email });
    //const findUser = await User.findOne({ email: email });
    if (findUser) {
      res.status(200).json({
        findUser,
        mgs: "user find",
      });
    } else {
      res.status(404).json({
        msg: "Companies not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
