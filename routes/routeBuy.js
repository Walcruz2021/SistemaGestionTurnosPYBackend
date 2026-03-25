import express from 'express';
const router = express.Router();
import { addBuySupply, editBuySupply,getBuySupplyXId,getBuySupplyXNInvoice,getListBuySuppliesByDateCurrent} from '../controllers/supply/controllersBuySupply.js';

router.post('/addBuySupply', addBuySupply);
router.put('/editBuySupply/:idBuySupply', editBuySupply);
router.get('/getBuySupplyXId/:idBuySupply', getBuySupplyXId);
router.get('/getBuySupplyXNInvoice/:idCompany', getBuySupplyXNInvoice);
router.get('/getListBuySuppliesByDateCurrent/:idCompany', getListBuySuppliesByDateCurrent);

export default router