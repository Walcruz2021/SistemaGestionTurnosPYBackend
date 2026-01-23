import express from 'express';
const router = express.Router();
import {addSupply, editSupply,getSupplyXId,getSuppliesBySupplier,getListSupplies,getSuppliesBycategory,getListBuySupplies,editSupplyByList} from "../../controllers/supply/controllersSupply.js";

router.post('/addSupply', addSupply);
router.put('/editSupply/:idSupply', editSupply);
router.put('/editSupplyByList', editSupplyByList);
router.get('/getSupplyXId/:idSupply', getSupplyXId);
router.get('/getSuppliesBySupplier/:idSupplier', getSuppliesBySupplier);
router.get('/getListSupplies/:idCompany', getListSupplies);
router.get('/getSuppliesBycategory/:category', getSuppliesBycategory);
router.get('/getListBuySupplies/:idCompany', getListBuySupplies);

export default router;