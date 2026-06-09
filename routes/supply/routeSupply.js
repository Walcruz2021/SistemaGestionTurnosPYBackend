import express from 'express';
const router = express.Router();
import {addSupply, editSupply,getSupplyXId,getSuppliesBySupplier,getListSupplies,getSuppliesBycategory,editSupplyByList,getListSuppliesGral,addSupplyImage} from "../../controllers/supply/controllersSupply.js";
import {addFieldStatus,addFieldNumSale} from "../../controllers/supply/controllersSaleSupply.js";
import upload from "../../middleware/multerConfig.js";


router.post('/addSupply', addSupply);
router.put('/editSupply/:idSupply', editSupply);
router.put('/editSupplyByList', editSupplyByList);
router.get('/getSupplyXId/:idSupply', getSupplyXId);
router.get('/getSuppliesBySupplier/:idSupplier', getSuppliesBySupplier);
router.get('/getListSupplies/:idCompany', getListSupplies);
router.get('/getListSuppliesGral', getListSuppliesGral);
router.get('/getSuppliesBycategory/:category', getSuppliesBycategory);
router.put('/addFieldStatus', addFieldStatus);
router.put('/addFieldNumSale', addFieldNumSale);
router.post(
    "/addSupplyImage/:idSupply",
    upload.single("image"), 
    addSupplyImage
);

export default router;