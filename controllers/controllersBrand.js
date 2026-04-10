import Brand from "../models/brand.js";

export const addBrand = async (req, res) => {
    const { nameBrand } = req.body;


    try {
        const newBrand = new Brand({
            nameBrand
        });
        await newBrand.save();
        return res.status(200).json({
            msg: "brand created correctly",
            newBrand,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};


export const listBrands = async (req, res) => {
    try {

        let brands = await Brand.find({

        });

        if (brands.length > 0) {

            return res.status(200).json({ brands });
        } else {
            return res.status(204).json({ message: "Brand not found" });
        }
    } catch (err) {
        console.error("Error al listar los brands:", err);
        return res
            .status(500)
            .json({ message: "Error interno del servidor", error: err.message });
    }
};