const jwt = require("jsonwebtoken");
require("dotenv").config();

function sign(payload, isAccessToken) {
// //PAYLOAD: { user: { email: 'walter@gmail.com', id: '64c3c2ecfcd7c13630cd22f6' } }
//   return jwt.sign(
//     payload.user,
//     isAccessToken
//       ? process.env.ACCESS_TOKEN_SECRET
//       : process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: 3600,
//       algorithm: "HS256",
//     }
//   );
  //PAYLOAD: { user: { email: 'walter@gmail.com', id: '64c3c2ecfcd7c13630cd22f6' } }
  const resp=jwt.sign(
    payload.user,
    isAccessToken
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: 3600,
      algorithm: "HS256",
    }
  );
  //console.log(resp,"everifififif")
  return resp
}

// Función para generar un token de acceso utilizando jsonwebtoken
function generateAccessToken(user) {
 // user={ email: 'walter@gmail.com', id: '64c3c2ecfcd7c13630cd22f6' }
 const accessT= sign({ user }, true);
 console.log(accessT,"----GENERATE ACCESS TOKEN----")
 return accessT
}
function generateRefreshToken(user) {
  return sign({ user }, false);
}

module.exports = { generateAccessToken, generateRefreshToken };