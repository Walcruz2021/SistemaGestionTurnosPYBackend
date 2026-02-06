import mongoose from "mongoose";
import CompanySupply from "../../models/companySupply.js";
import StockBatch from "../../models/supply/stockBatch.js";
import StockAdjustment from "../../models/supply/stockAdjustment.js";

export const createStockAdjustment = async (req, res) => {
    const {
        idCompany,
        idCompanySupply,
        quantity,
        typeAdjustment,
        noteAdjustment,
        date
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1️⃣ Validaciones básicas
        if (!idCompany || !idCompanySupply || !quantity || !typeAdjustment) {
            throw new Error("Faltan datos obligatorios");
        }

        if (quantity <= 0) {
            throw new Error("La cantidad debe ser mayor a cero");
        }

        const allowedTypes = ["DAÑADO", "VENCIDO", "PERDIDO", "ROBO", "DIFERENCIA DE INVENTARIO", "DONACIÓN", "MUESTRA"];
        if (!allowedTypes.includes(typeAdjustment)) {
            throw new Error("Tipo de ajuste inválido");
        }

        // 2️⃣ Validar CompanySupply
        const companySupply = await CompanySupply.findOne({
            _id: idCompanySupply,
            idCompany
        }).session(session);

        if (!companySupply) {
            throw new Error("Insumo inválido para la empresa");
        }

        // 3️⃣ Verificar stock disponible
        const stockAgg = await StockBatch.aggregate([
            {
                $match: {
                    idCompanySupply: new mongoose.Types.ObjectId(idCompanySupply),
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

        if (stockAvailable < quantity) {
            throw new Error("Stock insuficiente para realizar el ajuste");
        }

        // 4️⃣ Descontar stock por FIFO
        let remaining = quantity;

        const batches = await StockBatch.find({
            idCompanySupply,
            quantity: { $gt: 0 }
        })
            .sort({ datePurchase: 1 }) // FIFO
            .session(session);

        for (const batch of batches) {
            if (remaining <= 0) break;

            const usedQty = Math.min(batch.quantity, remaining);

            batch.quantity -= usedQty;
            remaining -= usedQty;

            await batch.save({ session });

            // 5️⃣ Registrar ajuste por lote
            await StockAdjustment.create(
                [
                    {
                        idCompany,
                        idCompanySupply,
                        idStockBatch: batch._id,
                        quantity: usedQty,
                        typeAdjustment,
                        unitCost: batch.unitCost,
                        totalCost: usedQty * batch.unitCost,
                        noteAdjustment: noteAdjustment || "",
                        date: date || new Date()
                    }
                ],
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Ajuste de stock registrado correctamente"
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        return res.status(400).json({
            message: error.message || "Error al registrar el ajuste de stock"
        });
    }
};