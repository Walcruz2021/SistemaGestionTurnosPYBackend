import express from 'express';
const router = express.Router();
import {addSupplyVariant,getListSupplyVariants} from "../../controllers/supply/controllersSupplyVariant.js";


router.post('/addSupplyVariant', addSupplyVariant);

router.get('/getListSupplyVariants', getListSupplyVariants);

export default router;