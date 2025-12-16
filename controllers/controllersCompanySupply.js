import CompanySupply from "../models/companySupply.js";

export const addCompanySupply = async (req, res, next) => {
    const { status, idGlobalSupply, priceSale, idCompany } = req.body;
    const companySupply = new CompanySupply({ status, idGlobalSupply, priceSale, idCompany });
    try {

        await companySupply.save();
        res.status(201).json({ message: "Company Supply Added Successfully", companySupply });
    } catch (error) {
        console.log(error)
    }
} 

