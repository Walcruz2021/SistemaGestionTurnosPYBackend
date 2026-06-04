import CompanySupply from "../../models/companySupply/companySupply.js";
import Supply from "../../models/supply/supply.js";
import mongoose from "mongoose";

export const addCompanySupply = async (req, res, next) => {
    const { status, idGlobalSupply, priceSale, idCompany } = req.body;
    const companySupply = new CompanySupply({ status, idGlobalSupply, priceSale, idCompany });
    try {

        await companySupply.save();
        res.status(200).json({ message: "Company Supply Added Successfully", companySupply });
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

export const addFieldNameSupplyinCompanySupply = async (req, res) => {
    try {

        const companyS = await CompanySupply.find();


        for (const company of companyS) {


            const supply = await Supply.findById(company.idGlobalSupply)

            if (supply) {
                company.nameSupply = supply.nameSupply;

            }
            await company.save();
        }

        return res.status(200).json({
            message: "CompanySupply actualizado correctamente"
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


export const listSuppliesStore = async (req, res) => {

    try {

        const { idCompany } = req.params;

        if (!mongoose.Types.ObjectId.isValid(idCompany)) {
            return res.status(400).json({
                message: "ID de empresa inválido"
            });
        }

        const supplies = await CompanySupply.find({
            idCompany,
            status: "active",
            visibleStore: true
        })
            .populate({
                path: "idGlobalSupply",
                populate: [
                    {
                        path: "idBrand"
                    },
                    {
                        path: "idCategory"
                    }
                ]
            });

        return res.status(200).json(supplies);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error del servidor"
        });
    }
};