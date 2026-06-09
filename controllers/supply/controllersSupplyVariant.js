import SupplyVariant from "../../models/supply/supplyVariant.js";
import Brand from "../../models/brand/brand.js";
import Supply from "../../models/supply/supply.js";
import Category from "../../models/category/category.js";
import Supplier from "../../models/supplier/supplier.js";
import BuySupplies from "../../models/supply/buySupply.js"
import CompanySupply from "../../models/companySupply/companySupply.js";
import mongoose from "mongoose";
import crypto from "crypto";
import axios from "axios";
import FormData from "form-data";
/**
 * 
 * @param idSupply
 * @param peso|unidad|sabor|talle|color
 * @returns newSupplyVariant
 */
export const addSupplyVariant = async (req, res) => {
    // peso && sabor || talle && color
    const {
        idSupply,
        peso,
        unidad,
        sabor,
        talle,
        color,
        name,
    } = req.body;


    function filteredAttributes(peso, sabor, talle, color, unidad) {

        let data
        if (peso && sabor && unidad) {
            data = {
                peso: peso,
                sabor: sabor,
                typeUnid: unidad
            }
        } else if (talle && color && unidad) {
            data = {
                talle: talle,
                color: color,
                typeUnid: unidad
            }
        }
        return data
    }

    const dataAttributes = filteredAttributes(peso, sabor, talle, color, unidad)

    try {


        function generateHash(attributes) {
            const normalized = JSON.stringify(
                Object.keys(attributes)
                    .sort()
                    .reduce((acc, key) => {
                        acc[key] = attributes[key];
                        return acc;
                    }, {})
            );

            return crypto
                .createHash("sha256")
                .update(normalized)
                .digest("hex");
        }

        const attributeHash = generateHash(dataAttributes);


        const findIdSupply = await Supply.findOne({
            _id: idSupply
        })

        if (!findIdSupply) {
            return res.status(400).json({
                message: "idSupply not found"
            });
        }

        const findVariantKey = await SupplyVariant.findOne({
            attributeHash: attributeHash,
            idSupply: idSupply,
            name: name
        })

        if (findVariantKey) {
            return res.status(400).json({
                message: "supplyVariant duplicated"
            })
        }

        // Create supply variant
        const newSupplyVariant = new SupplyVariant({
            idSupply,
            //valueUnitMed,
            // sku,
            // imgStore,
            // description,
            name,
            attributeHash,
            attributes: dataAttributes
        });

        const savedSupplyVariant = await newSupplyVariant.save();

        return res.status(200).json({
            message: "Supply variant saved successfully",
            supplyVariant: savedSupplyVariant,
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


export const addSupplyVariantImages = async (req, res) => {
    try {
        const { idSupplyVariant } = req.params;

        const findSupplyVariant = await SupplyVariant.findById({_id :idSupplyVariant});

        if (!findSupplyVariant) {
            return res.status(404).json({
                msg: "SupplyVariant not found"
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                msg: "At least one image is required"
            });
        }

        const uploadedUrls = [];

        for (const file of req.files) {

            const base64Image = file.buffer.toString("base64");

            const formData = new FormData();

            formData.append("image", base64Image);

            const uploadResponse = await axios.post(
                `https://api.imgbb.com/1/upload?key=${process.env.API_KEY_IMGBB}`,
                formData,
                {
                    headers: formData.getHeaders()
                }
            );

            uploadedUrls.push(
                uploadResponse.data.data.url
            );
        }

        findSupplyVariant.imgStore.push(...uploadedUrls);

        await findSupplyVariant.save();

        return res.status(200).json({
            msg: "Images uploaded successfully",
            images: uploadedUrls
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};
