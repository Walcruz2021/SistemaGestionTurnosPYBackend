
import CompanySupply from "../../models/companySupply.js";
import StockBatch from "../../models/supply/stockBatch.js";
import SaleSupply from "../../models/supply/saleSupply.js";
import ReturnSale from "../../models/supply/returnSale.js";
import Supply from "../../models/supply/supply.js"
import mongoose from "mongoose";
import { sub } from "@tensorflow/tfjs";
import { argsToArgsConfig } from "graphql/type/definition.js";

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
                    quantitySale: usedQty,
                    unitCost: batch.unitCost,
                    priceSaleUnit,
                    subtotal: subtotalSale,
                    surcharge: surcharge || 0,
                    discount: discount || 0,
                    profit,
                    nameSupply: companySupply.nameSupply
                });


                batch.quantity -= usedQty;
                remaining -= usedQty;

                totalSale += subtotalSale;
                totalCost += subtotalCost;
                totalProfit += profit;


                await batch.save({ session });
            }
        }



        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000);

        const numeSale = `SALE-${timestamp}-${random}`;


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
                items: itemsFormatted,
                status: "completed",
                numeSale
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

    const idCompany = req.params.idCompany;

    const { date } = req.query;

    let str = date.toString();

    let year = parseInt(str.slice(0, 4));
    let month = parseInt(str.slice(4));


    if (!idCompany || !month || !year) {
        return res.status(400).json({
            message: "Parámetros incompletos"
        });
    }

    try {


        const salesByMonth = await SaleSupply.aggregate([
            {
                $match: {
                    idCompany: new mongoose.Types.ObjectId(idCompany),
                    status: { $in: ["completed", "partial_return"] }
                }
            },
            {
                $addFields: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                }
            },
            {
                $match: {
                    year: year,
                    month: month
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
                idCompany: new mongoose.Types.ObjectId(idCompany),
                status: "completed"
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
                category: "$supply.categorySupply",
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

//requests month for find sales by month Now
export const listSalesByMonthNow = async (req, res) => {
    let now = new Date();
    //   let month = now.getMonth() + 1;
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    const idCompany = req.params.idCompany



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
                    status: "completed",
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


export const salesByAnio = async (req, res) => {
    const idCompany = req.params.idCompany;
    const { date } = req.query;

    if (!idCompany || !date) {
        return res.status(400).json({
            message: "Parámetros incompletos"
        });
    }

    try {
        const year = parseInt(date);

        const startDate = new Date(Date.UTC(year, 0, 1));
        const endDate = new Date(Date.UTC(year + 1, 0, 1));

        const result = await SaleSupply.aggregate([
            {
                $match: {
                    idCompany: new mongoose.Types.ObjectId(idCompany),
                    status: "completed",
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },

            // Agregamos año y mes en UTC
            {
                $addFields: {
                    year: { $year: { date: "$date", timezone: "UTC" } },
                    month: { $month: { date: "$date", timezone: "UTC" } }
                }
            },

            {
                $facet: {

                    // 📄 1️⃣ Lista completa
                    sales: [
                        { $sort: { date: 1 } }
                    ],

                    // 📊 2️⃣ Totales generales
                    totals: [
                        {
                            $group: {
                                _id: null,
                                totalSale: { $sum: "$totalSale" },
                                totalPaymentMethodEfectivo: { $sum: "$paymentMethodEfectivo" },
                                totalPaymentMethodTarjeta: { $sum: "$paymentMethodTarjeta" },
                                totalPaymentMethodTransferencia: { $sum: "$paymentMethodTransferencia" },
                                totalTransactions: { $sum: 1 }
                            }
                        }
                    ],

                    // 📅 3️⃣ Totales por mes
                    monthlyTotals: [
                        {
                            $group: {
                                _id: "$month",
                                totalSale: { $sum: "$totalSale" },
                                totalPaymentMethodEfectivo: { $sum: "$paymentMethodEfectivo" },
                                totalPaymentMethodTarjeta: { $sum: "$paymentMethodTarjeta" },
                                totalPaymentMethodTransferencia: { $sum: "$paymentMethodTransferencia" },
                                totalTransactions: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]);

        const data = result[0];

        return res.status(200).json({
            year,
            sales: data.sales,
            totals: data.totals[0] || {
                totalSale: 0,
                totalPaymentMethodEfectivo: 0,
                totalPaymentMethodTarjeta: 0,
                totalPaymentMethodTransferencia: 0,
                totalTransactions: 0
            },
            monthlyTotals: data.monthlyTotals
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


/**
 *
 * @param {*} req idCompany and idSale
 * @param {*} res
 * @returns modified collection stockbatch and create collection returnSale and modified collection saleSupply. Note Credit
 */
export const returnSale = async (req, res) => {
    const { idCompany } = req.params;

    const { date, arraySupplies, idSale, reason } = req.body;
    const arrayItems = [];
    let totalReturn = 0;
    try {


        const sale = await SaleSupply.findById({ _id: idSale, idCompany });

        if (!sale) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        if (sale.status === "returned") {
            return res.status(400).json({ message: "Ya fue devuelta" });
        }

        for (const itemReturn of arraySupplies) {

            const itemSale = sale.items.find(item => item._id.toString() === itemReturn.idItemSale);

            if (!itemSale) {
                throw new Error("Producto no encontrado en la venta");
            }
            if (itemReturn.quantityReturn > itemSale.quantitySale - itemSale.quantityReturned) {

                throw new Error("Cantidad a devolver excede la cantidad vendida");
            }

            if (itemSale && itemReturn.quantityReturn > 0 && itemReturn.quantityReturn <= itemSale.quantitySale - itemSale.quantityReturned) {
                const proportion = itemReturn.quantityReturn / itemSale.quantitySale;
                const subtotal = itemSale.subtotal * proportion;
                const surchargeNew = itemSale.surcharge * proportion;
                const discountNew = itemSale.discount * proportion;
                const profit = itemSale.profit * proportion;
              
                totalReturn += subtotal;

                const newItemReturn = {
                    idItemSale: itemSale._id,
                    idCompanySupply: itemSale.idCompanySupply,
                    idGlobalSupply: itemSale.idGlobalSupply,
                    idStockBatch: itemSale.idStockBatch,
                    quantityReturned: itemReturn.quantityReturn,
                    unitCost: itemSale.unitCost,
                    priceSaleUnit: itemSale.priceSaleUnit,
                    subtotal: subtotal,
                    surcharge: surchargeNew,
                    discount: discountNew,
                    profit: subtotal - (itemSale.unitCost * itemReturn.quantityReturn)
                };


                arrayItems.push(newItemReturn)

                //console.log(arrayItems)
                // 🔁 devolver stock

                await StockBatch.findByIdAndUpdate(
                    itemSale.idStockBatch,
                    { $inc: { quantity: itemReturn.quantityReturn } },
                    { new: true }
                );
                await SaleSupply.findOneAndUpdate(
                    { _id: idSale, "items._id": itemSale._id },
                    { $inc: { "items.$.quantityReturned": itemReturn.quantityReturn } },
                    { new: true }
                );
            }


        }
        // 💸 registrar devolución
        await ReturnSale.create({
            idSale: sale._id,
            date: date || new Date(),
            totalReturn: totalReturn,
            items: arrayItems,
            reason: reason || "No especific"
        });


        // 📌 marcar venta 
        sale.totalReturned = (sale.totalReturned || 0) + totalReturn;

        if (sale.totalReturned >= sale.totalSale) {
            sale.status = "returned";
        } else {
            sale.status = "partial_return";
        }


        await sale.save();

        return res.status(200).json({
            message: "Venta devuelta correctamente"
        });
    } catch (error) {
        res.status(500).json({ message: "Error del servidor" });
    }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns add field on the collection
 */
export const addFieldStatus = async (req, res) => {

    try {

        // 5️⃣ Crear venta
        await SaleSupply.updateMany(
            {}, { $set: { status: "completed" } }
        );


        return res.status(200).json({
            message: "field added successfully"
        });

    } catch (error) {

        console.error(error);
        return res.status(400).json({
            message: error.message || "Error al registrar la venta"
        });
    }
};


export const addFieldNumSale = async (req, res) => {
    try {

        const sales = await SaleSupply.find({
            numeSale: { $exists: false }
        });


        for (const sale of sales) {
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 1000);

            sale.numeSale = `SALE-${timestamp}-${random}`;
            await sale.save();
        }

        console.log("✅ Ventas actualizadas correctamente");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export const addFieldNameSupply = async (req, res) => {
    try {

        const sales = await SaleSupply.find();


        for (const sale of sales) {
            for (const item of sale.items) {

                const supply = await Supply.findById(item.idGlobalSupply)

                if (supply) {
                    item.nameSupply = supply.nameSupply;

                } else {
                    item.nameSupply = "no tiene";

                }

            }
            await sale.save();
        }

        return res.status(200).json({
            message: "Ventas actualizadas correctamente"
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}