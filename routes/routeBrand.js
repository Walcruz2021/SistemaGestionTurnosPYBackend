import express from 'express';
const router = express.Router();
import {addBrand,listBrands} from "../controllers/controllersBrand.js";

router.post('/addBrand', addBrand)
router.get('/listBrands', listBrands);


export default router;