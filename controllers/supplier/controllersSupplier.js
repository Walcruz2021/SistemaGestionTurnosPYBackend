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
        if (!nameSupplier || !address || !phone || !Company) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const cleanNameSupplier = nameSupplier.trim();

        if (!cleanNameSupplier) {
            throw new Error("The supplier name is required.");
        }
  

        const cleanAddress = address.trim();

        if (!cleanAddress) {
            throw new Error("The supplier address is required.");
        }

          const cleanPhone = phone.trim();

        if (!cleanPhone) {
            throw new Error("The supplier phone is required.");
        }

        const newSupplier = new Supplier({
            nameSupplier: cleanNameSupplier,
            address: cleanAddress,
            cuit,
            phone: cleanPhone,
            Company
        });

        await newSupplier.save();
        return res.status(200).json({ message: "Supplier saved successfully", newSupplier });

    } catch (error) {
        console.dir(error, { depth: null });
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const listSupplier = async (req, res) => {
    const { idCompany } = req.params
    try {
        const listSupplier = await Supplier.find({ status: true, Company: idCompany });


        return res.status(200).json({ message: "Suppliers retrieved successfully", listSupplier });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}