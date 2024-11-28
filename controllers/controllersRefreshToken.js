// const Token=require("../models/token")
// const { jsonResponse } = require("../lib/jsonResponse");
// //const log = require("../lib/trace");
// const { verifyRefreshToken } = require("../auth/verify");
// const { generateAccessToken } = require("../auth/sign");
// const getUserInfo = require("../lib/getUserInfo");

// export const refreshToken=async(req,res,next)=>{
//     // log.info("POST /api/refresh-token");
//     const refreshToken = req.body.refreshToken;
 
//     if (!refreshToken) {
//       console.log("No se proporcionó token de actualización", refreshToken);
//       return res
//         .status(401)
//         .json({ error: "Token de actualización no proporcionado" });
//     }
  
//     try {
//       const tokenDocument = await Token.findOne({ token: refreshToken });
  
//       if (!tokenDocument) {
//         return res.status(403).json({ error: "Token de actualización inválido" });
//       }

//       const payload = verifyRefreshToken(tokenDocument.token);
//       //console.log(payload,"PAYLOAD")
//       const accessToken = generateAccessToken(getUserInfo(payload.user));
//       //console.log(accessToken,"ACCES TOKENB")
      
//       //NO ESTA LLEGANDO EL ACCESTOKEN
//       if(accessToken){
//         res.json(jsonResponse(200, { accessToken }));
//       }else{
//         return res.status(401).json({status:"no existe accesToken"})
//       }
//     } catch (error) {
//       return res.status(403).json({ error: "Token de actualización inválido" });
//     }
// }

