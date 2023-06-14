const jwt=require("jsonwebtoken")
const{
    JWT_SECRET
  }=process.env

//GENERAR UN TOKEN FIRMADO

const tokenSign = async (user) => {

    //el uso de una promesa en este caso nos permite escribir un código más legible y manejar de manera más conveniente la asincronía de 
    //la generación del token.
    //El motivo de utilizar una promesa en este caso es que la función jwt.sign tiene una naturaleza asincrónica, ya que genera un token de 
    //manera asíncrona y llama a un callback cuando ha terminado. Sin embargo, en muchos casos es más conveniente trabajar con código 
    //asincrónico utilizando promesas en lugar de callbacks.

    return new Promise((resolve, reject) => {
      jwt.sign(user, JWT_SECRET, { expiresIn: '1h' }, (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  };

  const verifyToken = async(token)=>{
    try{
        return jwt.verify(token, JWT_SECRET)
    }catch(err){
        return null
    }
  }

module.exports={
    tokenSign,
    verifyToken
}