import ModelBrand from "../../models/modelBrand/modelBrand.js";

export const addModelBrand = async (req, res) => {
    const { idBrand,nameModel } = req.body;


    try {
        const newModelBrand = new ModelBrand({
            nameModel,
            idBrand
        });
        await newModelBrand.save();
        return res.status(200).json({
            msg: "newModelBrand created correctly"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};
