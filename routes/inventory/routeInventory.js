import { Router } from "express";
import { addInventory } from "../../controllers/inventory/controllersInventory.js";

const router = Router();    

router.post("/addInventory/:idCompany", addInventory);

export default router;
