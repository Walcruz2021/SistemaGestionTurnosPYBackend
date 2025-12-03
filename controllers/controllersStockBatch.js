import StockBatch from "../models/supply/stockBatch.js";

export const getStockBatchesByIdSupply = async (req, res) => {
    const idSupply = req.params.idSupply;
    console.log(idSupply)
    const listStockBatches = await StockBatch.find({ idSupply: idSupply });

    try {
        if (listStockBatches.length > 0) {
            res.status(200).json({
                listStockBatches,
            });
        } else {
            res.status(204).json({
                msg: "No stock batches found for the given supply ID",
            });
        }

    } catch (error) {
        console.log(error)
    }
}     