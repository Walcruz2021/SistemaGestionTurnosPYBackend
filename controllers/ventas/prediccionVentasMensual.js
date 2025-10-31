import { predictNextSale, predictNextSalesInCant } from "../../services/predictNextSale.js";


export const prediccionVtasMensual = async (req, res) => {
    const sales = req.query.data;

    try {
        const prediction = await predictNextSale(sales);
        console.log(prediction)
        res.status(200).json({ prediction });
    } catch (error) {
        console.error("Error en la predicción de ventas:", error);
        res.status(500).json({ error: "Error en la predicción de ventas" });
    }
}


//retorna 5 predicciones en base al array de las ultimas 5 ventas mensuales del cliente
export const prediccionVtasMensualInCant = async (req, res) => {
    const sales = req.query.data.reverse();

    try {
        const prediction = await predictNextSalesInCant(sales, 5);
        //console.log(prediction, "prediccionVtasMensualInCant");
        res.status(200).json({ prediction });
    } catch (error) {
        console.error("Error en la predicción de ventas:", error);
        res.status(500).json({ error: "Error en la predicción de ventas" });
    }
}