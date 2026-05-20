import express from 'express';
const router = express.Router();
import {addModelBrand} from "../../controllers/modelBrand/controllersModelBrand.js";

router.post('/addModelBrand', addModelBrand)



export default router;