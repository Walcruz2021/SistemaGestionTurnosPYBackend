
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

//request idCompanySupply for find sales by model
export const saleByModel = async (req, res) => {

    const { idCompanySupply, idCompany } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1️⃣ Validar CompanySupply
        const companySupply = await CompanySupply.findOne({
            _id: idCompanySupply,
            idCompany
        }).session(session);

        if (!companySupply) {
            throw new Error("Insumo inválido para la empresa");
        }

        // 2️⃣ Verificar ventas por Modelos
        const salesAgg = await SaleSupply.aggregate(

            [
                {
                    $match: {
                        idCompany: new mongoose.Types.ObjectId(idCompany),
                        "items.idCompanySupply": new mongoose.Types.ObjectId(idCompanySupply)
                    }
                },
                { $unwind: "$items" },
                {
                    $match: {
                        "items.idCompanySupply": new mongoose.Types.ObjectId(idCompanySupply)
                    }
                },
                {
                    $group: {
                        _id: "$items.idCompanySupply",
                        totalQuantity: { $sum: "$items.quantitySale" },
                        totalRevenue: { $sum: "$items.subtotal" },
                        totalProfit: { $sum: "$items.profit" }
                    }
                }
            ]

        ).session(session);

        return res.status(200).json({
            salesByModel: salesAgg
        });

    } catch (error) {
        console.log(error)
    }
}

//requests month for find sales by month
export const listSalesByMonth = async (req, res) => {
    const { idCompany, month, year } = req.body;

    if (!idCompany || !month || !year) {
        return res.status(400).json({
            message: "Parámetros incompletos"
        });
    }

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const salesByMonth = await SaleSupply.aggregate([
            {
                $match: {
                    idCompany: new mongoose.Types.ObjectId(idCompany),
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            }
        ]);

        return res.status(200).json({
            sales: salesByMonth,
            total: salesByMonth.length
        });
        //si no se encuentran ventas devolvera un array vacio

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

export const listSalesTopFive = async (req, res) => {

    const { idCompany } = req.body;

    if (!idCompany) {
        return res.status(400).json({
            message: "Parámetros incompletos"
        });
    }

    const topFiveSale = await SaleSupply.aggregate([

        {
            $match: {
                idCompany: new mongoose.Types.ObjectId(idCompany)
            }
        }
        ,
        //explore th field items field of the collection
        {
            $unwind:
                "$items"
        },

        //grouped by supply
        {
            $group: {
                _id: "$items.idGlobalSupply",
                totalQuantity: { $sum: "$items.quantitySale" },
                totalRevenue: { $sum: "$items.subtotal" },
                totalProfit: { $sum: "$items.profit" }
            }
        },

        { $sort: { totalProfit: -1 } },
        { $limit: 5 },

        //brings the data supply
        {
            $lookup: {
                from: "supplies",
                localField: "_id",
                foreignField: "_id",
                as: "supply"
            }
        },
        {
            $unwind: "$supply"
        },

        //data for the frontend
        {
            $project: {
                _id: 0,
                idGlobalSupply: "$_id",
                nameSupply: "$supply.nameSupply",
                brand: "$supply.nameBrand",
                talle: "$supply.valueUnidMed",
                category:"$supply.categorySupply",
                totalQuantity: 1,
                totalRevenue: 1,
                totalProfit: 1
            }
        }
    ])

    return res.status(200).json({
        topFiveSale
    })
}

