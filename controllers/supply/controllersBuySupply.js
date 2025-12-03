import BuySupply from "../../models/supply/buySupply.js";
import StockBatch from "../../models/supply/stockBatch.js"
import { response } from "express";
import mongoose from "mongoose";


export const addBuySupply = async (req, res) => {
    const { detailsSupply, montoN, montoB, date, iva, taxes, typeInvoice, paymentMethod, Company, NInvoice, nameSupplier, idSupplier } = req.body;
    //    detailsSupply ==>[]
    //    {
    //         idSupply: "",
    //         nameSupply: "",
    //         quantity: "",
    //         unitCost: "",
    //         idBrand: "",
    //         nameBrand: "",
    //         valueUnidMed: "",
    //         details:""
    //     }
    try {
        const newBuySupply = new BuySupply({
            detailsSupply, montoN, montoB, date, iva, taxes, typeInvoice, paymentMethod, Company, NInvoice, nameSupplier, idSupplier
        });
        await newBuySupply.save();
        const length = await StockBatch.countDocuments()
        // 2️⃣ Guardar cada lote de stock
        for (const item of detailsSupply) {
            await StockBatch.create({
                idSupply: item.idSupply,        // referencia al producto
                quantity: item.quantity,          // cantidad comprada
                unitCost: item.unitCost,      // precio unitario de compra
                datePurchase: date,           // fecha de la compra
                buySupply: newBuySupply._id,   // referencia a la compra
                nameLot: `Lote ${length}`
            });
        }

        return res.status(200).json({ message: "addBuySupply successful", newBuySupply });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }

}

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


