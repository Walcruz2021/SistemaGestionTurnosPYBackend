import Supply from "../../models/supply/supply.js";
import Brand from "../../models/brand/brand.js";
import Category from "../../models/category/category.js";
import Supplier from "../../models/supplier/supplier.js";
import BuySupplies from "../../models/supply/buySupply.js"
import CompanySupply from "../../models/companySupply/companySupply.js";
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


//esta ruta no se utilizara momentanemente ya que el usuario no deberia poder editar un insumo
export const editSupply = async (req, res) => {
    const { idSupply } = req.params;
    const { categorySupply, nameBrand, nameSupply, idBrand, priceSale, typeUnidMed, valueUnidMed, Company } = req.body;

    try {

        // Obtener supply actual
        const existingSupply = await Supply.findById(idSupply);

        if (!existingSupply) {
            return res.status(404).json({ message: "Supply not found" });
        }


        // Actualizar
        const updatedSupply = await Supply.findByIdAndUpdate(
            idSupply,
            {
                nameSupply,
                categorySupply,
                idBrand,
                nameBrand,
                typeUnidMed,
                valueUnidMed
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Supply updated successfully",
            updatedSupply
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

    const {
        nameSupply,
        idBrand,
        description,
        imgStore
    } = req.body;

    try {

        // Validations
        if (
            !nameSupply ||
            !idBrand
        ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        // Normalize values
        const normalizedNameSupply = nameSupply.trim().toLowerCase();

        const findName = await Supply.findOne({ nameSupply: normalizedNameSupply })
        if (findName) {
            return res.status(400).json({
                message: "name is duplicated"
            });
        }

        const findIdBrand = await Brand.findOne({
            _id: idBrand
        })

        if (!findIdBrand) {
            return res.status(400).json({
                message: "idBrand not found"
            });
        }

        // Create supply
        const newSupply = new Supply({
            nameSupply: normalizedNameSupply,
            idBrand,
            description,
            imgStore
        });

        const savedSupply = await newSupply.save();

        return res.status(200).json({
            message: "Supply saved successfully",
            supply: savedSupply
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

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


/**
 * @param {*} idCompany 
 * @param {*} res 
 * @returns collection CompanySupplies. list supplies with stock and batches of the company logued
 */

export const getListSupplies = async (req, res) => {

    const { idCompany } = req.params;
    try {


        const supplies = await CompanySupply.aggregate([
            {
                $match: {
                    idCompany: new mongoose.Types.ObjectId(idCompany)
                }
            },

            // INFORMACION GLOBAL DEL INSUMO
            {
                $lookup: {
                    from: "supplies",
                    localField: "idGlobalSupply",
                    foreignField: "_id",
                    as: "global"
                }
            },
            {
                $unwind: "$global"
            },

            //BRAND
            {
                $lookup: {
                    from: "brands",
                    localField: "global.idBrand",
                    foreignField: "_id",
                    as: "brand"
                }
            },
            {
                $unwind: {
                    path: "$brand",
                    preserveNullAndEmptyArrays: true
                }
            },

            //CATEGORY
            {
                $lookup: {
                    from: "categories",
                    localField: "brand.categories",
                    foreignField: "_id",
                    as: "categories"
                }
            },

            //FILTER DATA CATEGORIES REMOVE UNNECESARY DATA (createdAt, updatedAt) 
            {
                $lookup: {
                    from: "categories",
                    let: {
                        categoryIds: "$brand.categories"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$categoryIds"]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1
                            }
                        }
                    ],
                    as: "categories"
                }
            },

            {
                $addFields: {
                    "global.nameBrand": "$brand.nameBrand",
                    "global.categories": "$categories"
                }
            },
            {
                $project: {
                    brand: 0,
                    categories: 0
                }
            },

            // LOTES / BATCHES
            {
                $lookup: {
                    from: "stockbatches",
                    let: {
                        companySupplyId: "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$idCompanySupply",
                                        "$$companySupplyId"
                                    ]
                                }
                            }
                        },
                        {
                            $sort: {
                                datePurchase: 1
                            }
                        }
                    ],
                    as: "batches"
                }
            },

            // VARIANTES DE ESE INSUMO
            {
                $lookup: {
                    from: "companysupplyvariants",
                    let: {
                        companySupplyId: "$_id",
                        companyId: "$idCompany"
                    },
                    pipeline: [

                        // variantes de este companySupply
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$idCompanySupply",
                                        "$$companySupplyId"
                                    ]
                                }
                            }
                        },

                        // DATOS DE LA VARIANTE
                        {
                            $lookup: {
                                from: "supplyvariants",
                                localField: "idSupplyVariant",
                                foreignField: "_id",
                                as: "variant"
                            }
                        },
                        {
                            $unwind: {
                                path: "$variant",
                                preserveNullAndEmptyArrays: true
                            }
                        },

                        // STOCK DE LA VARIANTE
                        {
                            $lookup: {
                                from: "inventories",
                                let: {
                                    variantId: "$idSupplyVariant",
                                    companyId: "$$companyId"
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            "$idVariant",
                                                            "$$variantId"
                                                        ]
                                                    },
                                                    {
                                                        $eq: [
                                                            "$idCompany",
                                                            "$$companyId"
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ],
                                as: "inventory"
                            }
                        },

                        {
                            $unwind: {
                                path: "$inventory",
                                preserveNullAndEmptyArrays: true
                            }
                        },

                        // FORMATO FINAL DE CADA VARIANTE
                        {
                            $project: {
                                _id: 1,
                                idSupplyVariant: 1,

                                // precio de venta empresa
                                priceSale: 1,

                                // datos de variante
                                variant: {
                                    _id: "$variant._id",
                                    name: "$variant.name",
                                    description: "$variant.description",
                                    typeUnidMed: "$variant.typeUnidMed",
                                    valueUnitMed: "$variant.valueUnitMed",
                                    idSupply: "$variant.idSupply"
                                },

                                // stock
                                currentStock: {
                                    $ifNull: [
                                        "$inventory.currentStock",
                                        0
                                    ]
                                }
                            }
                        }
                    ],
                    as: "variants"
                }
            },

            // RESULTADO FINAL
            {
                $project: {
                    _id: 1,
                    idCompany: 1,
                    idGlobalSupply: 1,

                    // info global
                    global: 1,

                    // $category.nameBrand as saved in the collection
                    nameBrand: "$brand.nameBrand",
                    nameCategory: "$category.name",


                    // precio base
                    priceSale: 1,

                    // stock total
                    totalStock: 1,

                    // lotes
                    batches: 1,

                    // variantes + stock + precios
                    variants: 1
                }
            }
        ]);

        return res.status(200).json(supplies);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error del servidor." });
    }
};

export const getListSuppliesGral = async (req, res) => {
    try {
        const listSuppliesGral = await Supply.find()
        return res.status(200).json({
            listSuppliesGral
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error del servidor." });
    }


};

/**
 * 
 * @param {*} res 
 * @returns collection Supplies. list supplies used as supplygral.
 */

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

