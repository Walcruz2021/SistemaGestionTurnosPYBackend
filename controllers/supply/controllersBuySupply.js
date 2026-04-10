import BuySupply from "../../models/supply/buySupply.js";
import StockBatch from "../../models/supply/stockBatch.js"
import StockBatchBackup from "../../models/supply/stockBatchBackup.js"
import { response } from "express";
import mongoose from "mongoose";
import Supply from "../../models/supply/supply.js";
import CompanySupply from "../../models/companySupply.js";

export const addBuySupply = async (req, res) => {
    const {
        detailsSupply,
        montoN,
        montoB,
        date,
        iva,
        taxes,
        typeInvoice,
        paymentMethod,
        Company,
        NInvoice,
        nameSupplier,
        idSupplier
    } = req.body;

    // detailsSupply ==>[] // { // idSupply: "", // nameSupply: "", // quantity: "", // unitCost: "", // idBrand: "", // nameBrand: "", // valueUnidMed: "", // details:"", // priceSale:"" // }
  
    try {
        // 1️⃣ Crear la compra
        const newBuySupply = new BuySupply({
            detailsSupply,
            montoN,
            montoB,
            date,
            iva,
            taxes,
            typeInvoice,
            paymentMethod,
            Company,
            NInvoice,
            nameSupplier,
            idSupplier
        });

        await newBuySupply.save();

        let lotCounter = await StockBatch.countDocuments();

        // 2️⃣ Procesar cada insumo comprado
        for (const item of detailsSupply) {


            // 🔎 Buscar CompanySupply
            let companySupply = await CompanySupply.findOne({
                idCompany: Company,
                idGlobalSupply: item.idSupply
            });



            // 🆕 Si no existe, crearlo
            if (!companySupply) {
                companySupply = await CompanySupply.create({
                    idCompany: Company,
                    idGlobalSupply: item.idSupply,
                    nameSupply: item.nameSupply,
                    priceSale: item.priceSale
                });
            }


            // 📦 Crear el lote de stock ligado al CompanySupply
            await StockBatch.create({
                idSupply: item.idSupply,
                idCompanySupply: companySupply._id, // 🔥 CLAVE
                idCompany: Company,
                quantity: item.quantity,
                unitCost: item.unitCost,
                datePurchase: date,
                buySupply: newBuySupply._id,
                nameLot: `Lote ${++lotCounter}`
            });

            //no se lo utilizara momentaneamente
            //     await StockBatchBackup.create({
            //     idSupply: item.idSupply,
            //     idCompanySupply: companySupply._id, // 🔥 CLAVE
            //     idCompany: Company,
            //     quantity: item.quantity,
            //     unitCost: item.unitCost,
            //     datePurchase: date,
            //     buySupply: newBuySupply._id,
            //     nameLot: `Lote ${++lotCounter}`
            // });

            await CompanySupply.findByIdAndUpdate(companySupply._id, {
                priceSale: item.priceSale
            })
        }

        return res.status(200).json({
            message: "addBuySupply successful",
            newBuySupply
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const editBuySupply = async (req, res) => {
    const { idBuySupply } = req.params;

    const { nameSupply, cant, idSupply, montoN, montoB, date, iva, taxes, typeInvoice, paymentMethod, dueDate, observation, Company } = req.body;

    try {
        const updatedBuySupply = await BuySupply.findByIdAndUpdate(
            idBuySupply,
            { date, totalBuy, details, priceUnit, cantSupply, supplier, category },
            { new: true }
        );

        if (!updatedBuySupply) {
            return res.status(404).json({ message: "BuySupply not found" });
        }

        return res.status(200).json({ message: "BuySupply updated successfully", updatedBuySupply });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}


export const getBuySupplyXId = async (req, res) => {
    const { idBuySupply } = req.params;

    try {
        const findSupply = await BuySupply.findById(idBuySupply);

        if (!findSupply) {
            return res.status(404).json({ message: "BuySupply not found" });
        }

        return res.status(200).json({ message: "BuySupply retrieved successfully", findSupply });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const getBuySupplyXNInvoice = async (req, res) => {
    const { idCompany } = req.params;
     const { NInvoice } = req.query;

    try {
        const findSupply = await BuySupply.findOne({ NInvoice,Company:idCompany });

        return res.status(200).json({ message: "BuySupply retrieved successfully", findSupply });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const getListBuySuppliesByDateCurrent = async (req, res) => {
    const date = new Date();

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth(); // ⚠️ 0-based (ENERO = 0)

    const { idCompany } = req.params;

    try {
        // ✅ inicio del mes
    const startDate = new Date(Date.UTC(year, month, 1));
        const endDate = new Date(Date.UTC(year, month + 1, 1));


        const listGetBuySupplies = await BuySupply.find({
            Company: idCompany,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).sort({ date: -1 });

        return res.status(200).json({
            message: "BuySupplies retrieved successfully",
            listGetBuySupplies
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};