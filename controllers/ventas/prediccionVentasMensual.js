import { predictNextSale, predictNextSalesInCant } from "../../services/predictNextSale.js";


export const prediccionVtasMensual = async (req, res) => {
    const sales = req.query.data;

    try {
        const prediction = await predictNextSale(sales);
        res.status(200).json({ prediction });
    } catch (error) {
        console.error("Error en la predicción de ventas:", error);
        res.status(500).json({ error: "Error en la predicción de ventas" });
    }
}

export const prediccionVtasMensualInCant = async (req, res) => {
    const sales = req.query.data.reverse();
console.log(sales,"data ventas")
    try {
        const prediction = await predictNextSalesInCant(sales,5);
        console.log(prediction)
        res.status(200).json({ prediction });
    } catch (error) {
        console.error("Error en la predicción de ventas:", error);
        res.status(500).json({ error: "Error en la predicción de ventas" });
    }
}