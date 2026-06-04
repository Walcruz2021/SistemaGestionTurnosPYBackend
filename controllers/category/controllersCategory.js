import Category from "../../models/category/category.js";

export const addCategory = async (req, res) => {
    const { name } = req.body;

    try {

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "name required"
            });
        }

        const normalizedName = name.trim().toLowerCase();

        const categoryExist = await Category.findOne({
            name: normalizedName
        });

        if (categoryExist) {
            return res.status(400).json({
                message: "name duplicated"
            });
        }

        const newCategory = new Category({
            name: normalizedName
        });

        await newCategory.save();

        return res.status(200).json({
            message: "category added successfully",
            category: newCategory
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error en el servidor"
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        return res.status(200).json({
            message: "categories retrieved successfully",
            categories
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({

            message: "Error en el servidor"
        });                                      
    }
};