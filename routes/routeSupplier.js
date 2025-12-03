import express from 'express';
const router = express.Router();
import {addSupplier, editSupplier,getSupplierXId,listSupplier} from "../controllers/supplier/controllersSupplier.js";

router.post('/addSupplier', addSupplier);
router.put('/editSupplier/:idSupplier', editSupplier);
router.get('/getSupplierXId/:idSupplier', getSupplierXId);
router.get('/listSupplier/:idCompany', listSupplier);

export default router;