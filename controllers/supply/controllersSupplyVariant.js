import SupplyVariant from "../../models/supply/supplyVariant.js";
import Brand from "../../models/brand/brand.js";
import Supply from "../../models/supply/supply.js";
import Category from "../../models/category/category.js";
import Supplier from "../../models/supplier/supplier.js";
import BuySupplies from "../../models/supply/buySupply.js"
import CompanySupply from "../../models/companySupply/companySupply.js";
import mongoose from "mongoose";


export const addSupplyVariant = async (req, res) => {

    const {
        idSupply,
        typeUnidMed,
        valueUnitMed,
        sku,
        imgStore,
        description,
        name
    } = req.body;

    try {

        // Validations
        if (
            !idSupply ||
            !typeUnidMed ||
            !valueUnitMed ||
            !name
        ) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const findIdSupply = await Supply.findOne({
            _id: idSupply
        })

        if (!findIdSupply) {
            return res.status(400).json({
                message: "idSupply not found"
            });
        }


        // Create supply variant
        const newSupplyVariant = new SupplyVariant({
            idSupply,
            typeUnidMed,
            valueUnitMed,
            sku,
            imgStore,
            description,
            name
        });

        const savedSupplyVariant = await newSupplyVariant.save();

        return res.status(200).json({
            message: "Supply variant saved successfully",
            supplyVariant: savedSupplyVariant
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const getListSupplyVariants = async (req, res) => {

    const listSupplyVariants = await SupplyVariant.find();

    if (listSupplyVariants.length === 0) {
        return res.status(400).json({
            message: "No supply variants found"
        });
    }
    return res.status(200).json({
        message: "List of supply variants",
        listSupplyVariants
    }

    )
}

