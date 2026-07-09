import Company from "../models/company.js";
import User from "../models/user.js";

//postman OK
//graphql OK
export const addCompany = async (req, res, next) => {
  try {
    const {
      nameCompany,
      address,
      cuit,
      province,
      country,
      emailUser,
      category,
      slug,
    } = req.body;

    if (!nameCompany || !address || !category || !slug) {
      return res.status(400).json({
        msg: "missing data",
      });
    }

    const findUser = await User.findOne({ email: emailUser });

    if (!findUser) {
      return res.status(404).json({
        msg: "user not found",
      });
    }

    // Generar slug único
    let finalSlug = slug;
    let counter = 1;

    while (await Company.exists({ slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const newCompany = new Company({
      nameCompany,
      address,
      cuit,
      province,
      country,
      category,
      slug: finalSlug,
    });

    await newCompany.save();

    findUser.companies.push(newCompany._id);
    await findUser.save();

    return res.status(200).json({
      message: "Company added successfully",
      data: newCompany,
    });
  } catch (error) {
    next(error);
  }
};

//postman OK
//graphql OK
export const getCompanyXId = async (req, res, next) => {
  const { idCompany } = req.params
  console.log(idCompany)
  try {
    if (idCompany) {
      console.log(req.params.idCompany)
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

export const getCompanyBySlugCompany = async (req, res, next) => {
  const slugCompany = req.params.slugCompany

  if (!slugCompany) {
    res.status(400).json({
      msg: "slugCompany is undefined"
    })
  }


  const company = await Company.findOne({
    slug: slugCompany
  });

  if (!company) {
    res.status(400).json({
      msg: "company not found"
    })
  }

  return res.status(200).json({ company });

}