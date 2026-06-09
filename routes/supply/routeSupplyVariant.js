import express from 'express';
const router = express.Router();
import {addSupplyVariant,getListSupplyVariants,addSupplyVariantImages} from "../../controllers/supply/controllersSupplyVariant.js";
import upload from "../../middleware/multerConfig.js";

router.post('/addSupplyVariant', addSupplyVariant);

router.get('/getListSupplyVariants', getListSupplyVariants);

router.post(
    "/addSupplyVariantImages/:idSupplyVariant",
    upload.array("images", 3),
    addSupplyVariantImages
);
export default router;

