import Brand from "../../models/brand/brand.js";

export const addBrand = async (req, res) => {
    const { nameBrand, categories } = req.body;

    try {

        const findBrand=await Brand.findOne({nameBrand:nameBrand})
        if(findBrand){
            return res.status(400).json({msg:"The brand already exists"})
        }
        const newBrand = new Brand({
            nameBrand,
            categories
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

        let brands = await Brand.find({}).populate("categories", "name");

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