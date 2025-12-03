import Supplier from "../../models/supplier/supplier.js";


export const getSupplierXId = async (req, res) => {
    const { idSupplier } = req.params;

    try {
        const findSupplier = await Supplier.findById(idSupplier);

        if (!findSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        return res.status(200).json({ message: "Supplier retrieved successfully", findSupplier });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}


export const editSupplier = async (req, res) => {
    const { idSupplier } = req.params;
    const { nameSupplier, address, cuit, phone } = req.body;

    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            idSupplier,
            { nameSupplier, address, cuit, phone },
            { new: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        return res.status(200).json({ message: "Supplier updated successfully", updatedSupplier });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

export const addSupplier = async (req, res) => {
    const { nameSupplier, address, cuit, phone, Company } = req.body;

    try {
        const newSupplier = new Supplier({
            nameSupplier,
            address,
            cuit,
            phone,
            Company
        });

        await newSupplier.save();
        return res.status(200).json({ message: "Supplier saved successfully", newSupplier });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const listSupplier = async (req, res) => {
    const {idCompany} = req.params
    try {
        const listSupplier = await Supplier.find({ status: true, Company:idCompany});

        if (!listSupplier.length > 0) {
            return res.status(404).json({ message: "list Supplier not found" });
        }

        return res.status(200).json({ message: "Suppliers retrieved successfully", listSupplier });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}