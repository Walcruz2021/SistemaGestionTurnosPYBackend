import express from "express";
const router = express.Router();
import {
  addClient,
  uploadClients,
  listClients,
  listClientId,
  deleteClient,
  editClient,
} from "../controllers/controllersClients.js";

router.get("/listClientsCompany/:id", listClients);
router.post("/client", addClient);

//find Client by idClient
router.get("/listClients/:idClient", listClientId);
router.delete("/deleteClient/:idClient", deleteClient);
router.put("/editClient/:idClient", editClient);

export default router;
