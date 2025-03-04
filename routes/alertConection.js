import express from "express";
import mongoose from "mongoose";
const router = express.Router();

router.get("/health", (req, res) => {
  const mongoState = mongoose.connection.readyState;

  if (mongoState === 1) {
    return res
      .status(200)
      .json({ status: "ok", message: "Conectado a MongoDB" });
  } else {
    return res
      .status(500)
      .json({ status: "error", message: "No conectado a MongoDB" });
  }
});

export default router;
