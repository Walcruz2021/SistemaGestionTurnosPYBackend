import BuySupply from "../../models/supply/buySupply.js";
import StockBatch from "../../models/supply/stockBatch.js"
import StockBatchBackup from "../../models/supply/stockBatchBackup.js"
import { response } from "express";
import mongoose from "mongoose";
import Supply from "../../models/supply/supply.js";
import CompanySupply from "../../models/companySupply/companySupply.js";
import CompanySupplyVariant from "../../models/companySupplyVariant/companySupplyVariant.js";
import SupplyVariant from "../../models/supply/supplyVariant.js";
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

    // detailsSupply ==>[] // { // idVariant:"",idSupply: "", // nameSupply: "", // quantity: "", // unitCost: "", // idBrand: "", // nameBrand: "", // valueUnidMed: "", // details:"", // priceSale:"" // }
console.log(detailsSupply,"detalle de compra")
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
                    priceSale: item.priceSale,
                    visibleStore: true
                });
                console.log(companySupply,"companySupply creado desde compra")
            }


            // 📦 Crear el lote de stock ligado al CompanySupply
            await StockBatch.create({
                idSupply: item.idSupply,
                idCompanySupply: companySupply._id, // 🔥 CLAVE
                idCompany: Company,
                idVariant: item.idVariant,
                quantity: item.quantity,
                unitCost: item.unitCost,
                datePurchase: date,
                buySupply: newBuySupply._id,
                nameLot: `Lote ${++lotCounter}`
            });

            const supplyVariant = await SupplyVariant.findOne({ idSupply: item.idSupply });

            if (companySupply.idGlobalSupply.toString() ===
                supplyVariant.idSupply.toString()) {
                //siempre si o si se debe ingresar por este lado. No se puede ingresar un pedigree con modelo airforce1
                const findCompanySupplyVariant = await CompanySupplyVariant.findOne({
                    idCompanySupply: companySupply._id,
                    idSupplyVariant: item.idVariant
                });

                if (findCompanySupplyVariant) {
               
                    findCompanySupplyVariant.priceSale = item.priceSale;
                    await findCompanySupplyVariant.save();
                    continue;
                } else {

      
                    const companySupplyVariant = await CompanySupplyVariant.create({
                        idCompanySupply: companySupply._id,
                        idSupplyVariant: item.idVariant,
                        priceSale: item.priceSale
                    })
                }

            } else{
                res.status(400).json({ message: `El insumo ${item.nameSupply} no corresponde al modelo ${item.nameVariant}` });
                return;
            }
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
        const findSupply = await BuySupply.findOne({ NInvoice, Company: idCompany });

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

