import StockBatch from "../../models/supply/stockBatch.js";
import CompanySupply from "../../models/companySupply/companySupply.js";
import Supply from "../../models/supply/supply.js";

//agrega campo nuevo solbre cierta coleccion. EN este caso sobre StockBatch
export const addFieldsToScript = async (req, res) => {
    //se agregara idCompany a la coleccion StockBatch
    const idCompany = "66872b3a0945d93a4c124c05";
    const listStockBatch = await StockBatch.find();
    for (let i = 0; i < listStockBatch.length; i++) {
        let stockBatch = listStockBatch[i];
        stockBatch.idCompany = idCompany;
        await stockBatch.save();
    }
}

//agrega el idCompanySupply a la coleccion stockBatches
export const addIdCompanySupplyToScript = async (req, res) => {
    const { idSupply } = req.params;

    try {
        const supply = await Supply.findById(idSupply);
        if (!supply) {
            return res.status(404).json({ msg: "Supply not found" });
        }

        const companySupply = await CompanySupply.findOne({ idGlobalSupply: idSupply });
        if (!companySupply) {
            return res.status(404).json({ msg: "CompanySupply not found" });
        }

        const result = await StockBatch.updateMany(
            { idSupply: idSupply },
            { $set: { idCompanySupply: companySupply._id } }
        );

        return res.status(200).json({
            msg: "Field added successfully",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

