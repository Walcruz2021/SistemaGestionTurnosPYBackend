const express=require("express")
const router=express.Router()
const {addClient,uploadClients}=require("../controllers/controllersClients")
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/client',addClient)
router.post('/importClientsExcel',upload.single('file'),uploadClients)

module.exports=router