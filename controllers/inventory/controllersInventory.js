import Inventory from "../../models/inventory/inventory.js";


// arrayDataProducts:[
// {
//     idVariant: "123456789",
//     currentStock: 100
// }]
export const addInventory = async (req, res) => {

    try {

        const arrayDataProducts  = req.body;

        const {idCompany} = req.params;
   

        for (const item of arrayDataProducts) {

            // Buscar si ya existe inventario
            const findInventory = await Inventory.findOne({
                idVariant: item.idVariant,
                idCompany
            });

            // SI NO EXISTE → CREAR
            if (!findInventory) {

                const newInventory = new Inventory({
                    idCompany,
                    idVariant: item.idVariant,
                    currentStock: Number(item.quantity)
                });

                await newInventory.save();

            } else {

                // SI EXISTE → ACTUALIZAR STOCK

                findInventory.currentStock =
                    Number(findInventory.currentStock) +
                    Number(item.quantity);

                // opcional actualizar precio
                findInventory.priceSale = item.priceSale;

                await findInventory.save();
            }
        }

        return res.status(200).json({
            ok: true,
            msg: "Inventory updated correctly"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: "Server error"
        });
    }
};
