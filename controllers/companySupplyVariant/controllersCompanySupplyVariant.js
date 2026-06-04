import CompanySupplyVariant from "../../models/companySupplyVariant/companySupplyVariant.js";
import SupplyVariant from "../../models/supply/supplyVariant.js";
import CompanySupply from "../../models/companySupply/companySupply.js";
import mongoose from "mongoose";
import Inventory from "../../models/inventory/inventory.js";


export const addCompanySupplyVariant = async (req, res, next) => {
  const { idCompanySupply, idSupplyVariant, priceSale } = req.body;
  try {

    const findIdCompanySupply = await CompanySupply.findOne({ _id: idCompanySupply });
    if (!findIdCompanySupply) {
      return res.status(404).json({ message: "CompanySupply Not Found" });
    }

    const findIdCompanyVariant = await SupplyVariant.findOne({ _id: idSupplyVariant });
    if (!findIdCompanyVariant) {
      return res.status(404).json({ message: "SupplyVariant Not Found" });
    }

    const companySupplyVariant = new CompanySupplyVariant({ idCompanySupply, idSupplyVariant, priceSale });
    await companySupplyVariant.save();
    res.status(200).json({ message: "Company Supply Variant Added Successfully", companySupplyVariant });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error Adding Company Supply Variant", error });
  }
}

// export const getVariantsByCompanySupply = async (req, res) => {

//     try {

//         const { idCompanySupply } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(idCompanySupply)) {
//             return res.status(400).json({
//                 message: "ID inválido"
//             });
//         }

//         const listCompanyVariant = await CompanySupplyVariant.find({
//             idCompanySupply: idCompanySupply
//         })
//             .populate({
//                 path: "idSupplyVariant"
//             }),

//         return res.status(200).json({ message: "CompanySuppliesvariant retrieved successfully", listCompanyVariant });
//     } catch (error) {

//         console.log(error);

//         return res.status(500).json({
//             message: "Error del servidor"
//         });
//     }
// };


export const getVariantsByCompanySupply = async (req, res) => {
  try {
    const { idCompanySupply } = req.params;


    if (!mongoose.Types.ObjectId.isValid(idCompanySupply)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const findIdCompanySupply = await CompanySupply.findOne({ _id: idCompanySupply });
    if (!findIdCompanySupply) {
      return res.status(404).json({ message: "CompanySupply Not Found" });
    }
    // BUSCAR VARIANTES
    const listCompanyVariant = await CompanySupplyVariant.find({
      idCompanySupply: idCompanySupply,
    }).populate({
      path: "idSupplyVariant",
    });


    // AGREGAR INVENTARIO
    const variantsWithInventory = await Promise.all(
      listCompanyVariant.map(async (variant) => {

        const inventory = await Inventory.findOne({
          idVariant: variant?.idSupplyVariant?._id,
          idCompany: findIdCompanySupply?.idCompany,
        });


        return {
          ...variant.toObject(),

          inventory: inventory || null,

          currentStock: inventory?.currentStock || 0,
        };
      })
    );

    return res.status(200).json({
      message: "CompanySuppliesvariant retrieved successfully",
      listCompanyVariant: variantsWithInventory,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error del servidor",
    });
  }
};

/**
 * Updates a companySupplyVariant.
 * @param {Object} variantData - Variant data to update.
 * @param {string} variantData.idSupplyVariant - Variant identifier.
 * @param {string} variantData.nameSupplyVariant - Variant name (data to update).
 * @param {number} variantData.priceSale - Sale price.(data to update)
 * @param {string} variantData.idCompanySupply - CompanySupply identifier.
 * @returns new companySupplyVariant with data updated
 */

export const editCompanyVariantByParameter = async (req, res) => {
  const { idSupplyVariant } = req.params;
  const variantData = req.body;

  try {


    if (
      variantData.priceSale !== undefined &&
      (isNaN(variantData.priceSale) || Number(variantData.priceSale) <= 0)
    ) {
      return res.status(400).json({
        message: "priceSale must be a number greater than 0"
      });
    }
    // Obtener supply actual
    const existingCompSupplyVariant = await CompanySupplyVariant.findOne({
      idSupplyVariant: idSupplyVariant,
      idCompanySupply: variantData.idCompanySupply
    });

    if (!existingCompSupplyVariant) {
      return res.status(404).json({ message: "CompanySupplyVariant not found" });
    }


    const updatedCompSupplyVariant = await CompanySupplyVariant.findByIdAndUpdate(
      existingCompSupplyVariant._id,
      {
        ...variantData
      },
      { new: true }
    );

    return res.status(200).json({
      message: "CompanySupplyVariant updated successfully",
      updatedCompSupplyVariant
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};