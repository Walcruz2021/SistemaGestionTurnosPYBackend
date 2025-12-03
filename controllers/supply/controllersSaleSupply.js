import saleSupply from "../../models/supply/saleSupply.js";


export const addSaleSupply = async (req, res) => {
    const { date, totalSale, details, priceBuy, priceSale } = req.body;

    try {
        const newSaleSupply = new saleSupply({
            date,
            totalSale,
            details,
            priceBuy,
            priceSale
        });

        await newSaleSupply.save();
        return res.status(200).json({ message: "addSale saved successfully", newSaleSupply });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const editSaleSupply = async (req, res) => {
    const { idSaleSupply } = req.params;
    const { date, totalSale, details, priceBuy, priceSale } = req.body;

    try {
        const updatedSaleSupply = await saleSupply.findByIdAndUpdate(
            idSaleSupply,
            { date, totalSale, details, priceBuy, priceSale },
            { new: true }
        );

        if (!updatedSaleSupply) {
            return res.status(404).json({ message: "SaleSupply not found" });
        }

        return res.status(200).json({ message: "SaleSupply updated successfully", updatedSaleSupply });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}
