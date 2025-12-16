import Supply from "../../models/supply/supply.js";
import Supplier from "../../models/supplier/supplier.js";
import BuySupplies from "../../models/supply/buySupply.js"
import CompanySupply from "../../models/companySupply.js";
import mongoose from "mongoose";

export const getSupplyXId = async (req, res) => {
    const { idSupply } = req.params;

    try {
        const findSupply = await Supply.findById(idSupply);

        if (!findSupply) {
            return res.status(404).json({ message: "Supply not found" });
        }

        return res.status(200).json({ message: "Supply retrieved successfully", findSupply });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}


export const editSupply = async (req, res) => {
    const { idSupply } = req.params;
    const { nameSupply, categorySupply, idSupplier, nameSupplier, cant } = req.body;
    console.log(cant)
    try {
        // Convertir cantidad a número
        const cantNumber = Number(cant);

        if (isNaN(cantNumber)) {
            return res.status(400).json({ message: "La cantidad debe ser un número válido" });
        }

        // Obtener supply actual
        const existingSupply = await Supply.findById(idSupply);

        if (!existingSupply) {
            return res.status(404).json({ message: "Supply not found" });
        }

        // Suma correcta
        const newStock = (existingSupply.cant || 0) + cantNumber;

        // Actualizar
        const updatedSaleSupply = await Supply.findByIdAndUpdate(
            idSupply,
            {
                nameSupply,
                categorySupply,
                idSupplier,
                nameSupplier,
                cant: newStock
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Supply updated successfully",
            updatedSaleSupply
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const editSupplyByList = async (req, res) => {

    //se recibe una array de objetos
    // [{
    //     "idSupply": "691ba29793c100c9f3c88bd5",
    //     "cant": 2
    // }]

    const detailsSupply = req.body;

    try {
        const results = [];

        for (let supply of detailsSupply) {
            const { idBrand, idSupply, nameBrand, nameSupply, cant } = supply;

            // Convertir cantidad a número
            const cantNumber = Number(cant);
            if (isNaN(cantNumber)) {
                return res.status(400).json({ message: "La cantidad debe ser un número válido" });
            }

            // Obtener supply actual
            const existingSupply = await Supply.findById(idSupply);
            if (!existingSupply) {
                return res.status(404).json({ message: `Supply not found: ${idSupply}` });
            }

            // Stock actualizado
            const newStock = (existingSupply.cant || 0) + cantNumber;

            // Actualizar supply
            const updatedSupply = await Supply.findByIdAndUpdate(
                idSupply,
                {
                    idBrand,
                    nameSupply,
                    nameBrand,
                    cant: newStock
                },
                { new: true }
            );

            results.push(updatedSupply);
        }

        return res.status(200).json({
            message: "Supplies updated successfully",
            updatedSupplies: results
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};


export const addSupply = async (req, res) => {
    const { nameSupply, categorySupply, idBrand, nameBrand, Company, typeUnidMed, valueUnidMed, priceSale } = req.body;

    try {

        const newSupply = new Supply({
            nameSupply: `${nameSupply} - ${valueUnidMed}`,
            categorySupply,
            nameBrand,
            idBrand,
            //Company: Company,
            typeUnidMed,
            valueUnidMed,
            priceSale
        });

        await newSupply.save();
        return res.status(200).json({ message: "Supply saved successfully", newSupply });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

//retornna listado de insumos pertenecientes a un proveedor
export const getSuppliesBySupplier = async (req, res) => {
    const { idSupplier } = req.params;

    try {
        const findSupply = await Supply.find({ idSupplier });

        if (!findSupply) {
            return res.status(404).json({ message: "No supplies found for this supplier" });
        }

        return res.status(200).json({ message: "Supplies retrieved successfully", findSupply });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}


//se determino que exista un listado de insumos en general
export const getListSupplies = async (req, res) => {
    try {
        const { idCompany } = req.params;

        if (!mongoose.Types.ObjectId.isValid(idCompany)) {
            return res.status(400).json({ message: "ID de empresa inválido." });
        }

        const idCompanyObj = new mongoose.Types.ObjectId(idCompany);

        const supplies = await CompanySupply.aggregate([
            {
                $match: {
                    idCompany: idCompanyObj
                }
            },
            {
                $lookup: {
                    from: "supplies",
                    localField: "idGlobalSupply",
                    foreignField: "_id",
                    as: "global"
                }
            },
            { $unwind: "$global" },
            {
                $lookup: {
                    from: "stockbatches",
                    let: {
                        companySupplyId: "$_id",
                        idCompany: idCompanyObj
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$idCompanySupply", "$$companySupplyId"] },
                                        { $eq: ["$idCompany", "$$idCompany"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "batches"
                }
            },
            {
                $addFields: {
                    totalStock: { $sum: "$batches.quantity" }
                }
            },
            {
                $project: {
                    _id: 1,
                    idCompany: 1,
                    idGlobalSupply: 1,
                    global: 1,
                    batches: 1,
                    priceSale: 1,
                    totalStock: 1
                }
            }
        ]);

        return res.status(200).json(supplies);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error del servidor." });
    }
};

export const getSuppliesBycategory = async (req, res) => {
    const { category } = req.params;

    try {
        const findSupply = await Supply.find({ categorySupply: category });

        if (!findSupply) {
            return res.status(404).json({ message: "No supplies found for this supplier" });
        }

        return res.status(200).json({ message: "Supplies retrieved successfully", findSupply });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const getListBuySupplies = async (req, res) => {
    const { idCompany } = req.params
    const listGetBuySupplies = await BuySupplies.find({ Company: idCompany })
    try {
        if (listGetBuySupplies.length) {
            return res.status(200).json({
                message: "BuySupplies retrieved successfully", listGetBuySupplies
            })
        } else {
            return res.status(404).json({ message: "No BuySupplies found for this company" })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}