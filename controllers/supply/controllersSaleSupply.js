import saleSupply from "../../models/supply/saleSupply.js";
import CompanySupply from "../../models/companySupply.js";
import StockBatch from "../../models/supply/stockBatch.js";
import SaleSupply from "../../models/supply/saleSupply.js";
import mongoose from "mongoose";

export const addSaleSupply = async (req, res) => {
    const { idCompany, platformMethod, paymentMethodEfectivo, paymentMethodTarjeta, paymentMethodTransferencia, items, date } = req.body;


    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let totalSale = 0;
        let totalCost = 0;
        let totalProfit = 0;
        const itemsFormatted = [];

        for (const item of items) {

            // 1️⃣ Validar CompanySupply
            const companySupply = await CompanySupply.findOne({
                _id: item.idCompanySupply,
                idCompany
            }).session(session);

            if (!companySupply) {
                throw new Error("Insumo inválido para la empresa");
            }

            // 2️⃣ Verificar stock disponible
            const stockAgg = await StockBatch.aggregate([
                {
                    $match: {
                        idCompanySupply: new mongoose.Types.ObjectId(companySupply._id),
                        idCompany: new mongoose.Types.ObjectId(idCompany)
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$quantity" }
                    }
                }
            ]).session(session);



            const stockAvailable = stockAgg[0]?.total || 0;

            if (stockAvailable < item.quantitySale) {
                throw new Error(`Stock insuficiente para ${companySupply.nameSupply}`);
            }

            // // 3️⃣ Descontar stock FIFO
            let remaining = item.quantitySale;
            const priceSaleUnit = companySupply.priceSale;


            const batches = await StockBatch.find({
                idCompanySupply: companySupply._id,
                quantity: { $gt: 0 }
            })
                .sort({ datePurchase: 1 })
                .session(session);

            for (const batch of batches) {
                if (remaining <= 0) break;

                // La expresión Math.min(batch.quantity, remaining) devolverá el valor más bajo entre batch.quantity y remaining. 
                // Esto puede ser útil, por ejemplo, para asegurarse de que la cantidad de descuento que se aplique no exceda la cantidad restante disponible 
                // en stock.Así que, al final, discount contendrá el menor valor entre la cantidad del lote y la cantidad restante.
                const usedQty = Math.min(batch.quantity, remaining);
                const discount = Number(item.discount * usedQty) || 0;
                const surcharge = Number(item.surcharge * usedQty) || 0;
                const subtotalSale = usedQty * priceSaleUnit - discount + surcharge;
                const subtotalCost = usedQty * batch.unitCost;
                const profit = subtotalSale - subtotalCost;

                itemsFormatted.push({
                    idCompanySupply: companySupply._id,
                    idGlobalSupply: companySupply.idGlobalSupply,
                    idStockBatch: batch._id,
                    quantitySale: item.quantitySale,
                    unitCost: batch.unitCost,
                    priceSaleUnit,
                    subtotal: subtotalSale,
                    surcharge: surcharge || 0,
                    discount: discount || 0,
                    profit
                });


                batch.quantity -= usedQty;
                remaining -= usedQty;

                totalSale += subtotalSale;
                totalCost += subtotalCost;
                totalProfit += profit;


                await batch.save({ session });
            }
        }

        // 5️⃣ Crear venta
        const sale = await SaleSupply.create(
            [{
                idCompany,
                platformMethod,
                paymentMethodEfectivo,
                paymentMethodTarjeta,
                paymentMethodTransferencia,
                date,
                totalSale,
                totalCost,
                totalProfit,
                items: itemsFormatted
            }],
            { session }
        );
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Venta registrada correctamente",
            sale: sale[0]
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        return res.status(400).json({
            message: error.message || "Error al registrar la venta"
        });
    }
};

// export const editSaleSupply = async (req, res) => {
//     const { idSaleSupply } = req.params;
//     const { date, totalSale, details, priceBuy, priceSale } = req.body;

//     try {
//         const updatedSaleSupply = await saleSupply.findByIdAndUpdate(
//             idSaleSupply,
//             { date, totalSale, details, priceBuy, priceSale },
//             { new: true }
//         );

//         if (!updatedSaleSupply) {
//             return res.status(404).json({ message: "SaleSupply not found" });
//         }

//         return res.status(200).json({ message: "SaleSupply updated successfully", updatedSaleSupply });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Error en el servidor" });
//     }
// }
