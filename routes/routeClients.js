import express from "express"
const router=express.Router()
import {addClient,uploadClients} from "../controllers/controllersClients.js"
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/client',addClient)
router.post('/importClientsExcel',upload.single('file'),uploadClients)

export default router