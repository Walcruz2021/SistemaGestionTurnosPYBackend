import express from 'express';
const router = express.Router();
import {addSupply, editSupply,getSupplyXId,getSuppliesBySupplier,getListSupplies,getSuppliesBycategory,editSupplyByList,getListSuppliesGral} from "../../controllers/supply/controllersSupply.js";

router.post('/addSupply', addSupply);
router.put('/editSupply/:idSupply', editSupply);
router.put('/editSupplyByList', editSupplyByList);
router.get('/getSupplyXId/:idSupply', getSupplyXId);
router.get('/getSuppliesBySupplier/:idSupplier', getSuppliesBySupplier);
router.get('/getListSupplies/:idCompany', getListSupplies);
router.get('/getListSuppliesGral', getListSuppliesGral);
router.get('/getSuppliesBycategory/:category', getSuppliesBycategory);



export default router;