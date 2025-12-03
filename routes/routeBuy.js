import express from 'express';
const router = express.Router();
import { addBuySupply, editBuySupply,getBuySupplyXId} from '../controllers/supply/controllersBuySupply.js';

router.post('/addBuySupply', addBuySupply);
router.put('/editBuySupply/:idBuySupply', editBuySupply);
router.get('/getBuySupplyXId/:idBuySupply', getBuySupplyXId);

export default router