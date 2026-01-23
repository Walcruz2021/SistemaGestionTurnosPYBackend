import CompanySupply from "../../models/companySupply.js";

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

export const editCompanySupply = async (req, res) => {
    const { idCompany } = req.params;
    const { priceSale, idGlobalSupply } = req.body;

    try {

        // Obtener supply actual
        const existingCompSupply = await CompanySupply.findOne({ idCompany: idCompany, idGlobalSupply: idGlobalSupply });

       
        if (!existingCompSupply) {
            return res.status(404).json({ message: "CompanySupply not found" });
        }


        const updatedCompSupply = await CompanySupply.findByIdAndUpdate(
            existingCompSupply._id,
            {
                priceSale
            },
            { new: true }
        );

        return res.status(200).json({
            message: "CompanySupply updated successfully",
            updatedCompSupply
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
