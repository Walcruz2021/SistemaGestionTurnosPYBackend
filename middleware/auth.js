const { verifyToken } = require("../helpers/generateTokens");

const checkAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ").pop();
      const tokenData = await verifyToken(token);
      if (tokenData) {
        next();
      }else{
        res.status(400);
        res.send({error:"token incorrecto"})
      }
    } else {
      res.status(409);
      res.send({ error: "ruta denegada" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  checkAuth,
};
