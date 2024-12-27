import express from "express"
const router=express.Router()
import {addClient,uploadClients,listClients,listClientId,deleteClient,editClient} from "../controllers/controllersClients.js"
//import multer from 'multer'

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

router.get('/listClientsCompany/:id',listClients)
router.post('/client',addClient)
//router.post('/importClientsExcel',upload.single('file'),uploadClients)
//find Client by idClient
router.get("/listClients/:idClient", listClientId);
router.delete("/deleteClient/:idClient", deleteClient);
router.put("/editClient/:idClient", editClient);

export default router