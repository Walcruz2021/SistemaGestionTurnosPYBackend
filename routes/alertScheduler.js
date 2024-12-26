import cron from "node-cron";
import nodemailer from "nodemailer";
import Turno from "../models/turno.js";
import Configuration from "openai";
import Cliente from "../models/cliente.js";
//import OpenAIApi from "openai"
//import { isFunctionMessage } from "openai/src/lib/chatCompletionUtils.js";
// Configuración de OpenAI

//se comenta hasta que reestabelzca las slicitudes de openAI

// const configuration = new Configuration({
//   apiKey: ""
// });

//const openai = new OpenAIApi(configuration);

//generacion de mje con gpt4
// const generateEmailContent = async (clientName, dogName, date, time) => {
//   const prompt = `
//     Escribe un email de recordatorio amigable y profesional para ${clientName} que tiene un turno para su perro ${dogName} el ${date} a las ${time}. Incluye consejos para preparar a la mascota antes del turno.
//   `;

//   try {
//     // Utilizando la nueva forma de llamar a la API
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // Modelo de GPT que deseas usar
//       messages: [{ role: "system", content: "Eres un asistente amigable y profesional." }, { role: "user", content: prompt }],
//     });

//     // Acceder al contenido generado
//     const emailContent = response.choices[0].message.content.trim();
//     return emailContent;
//   } catch (error) {
//     console.error("Error al generar contenido del email:", error);
//     throw error;
//   }
// };

// Configuración del transportador de correo
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NOTIFICATIONS,
    pass: process.env.PASSWORD_EMAIL_NOTIFICATIONS,
  },
  tls: {
    rejectUnauthorized: false, // Ignorar certificados no confiables en pruebas locales
  },
});

// Función para enviar notificaciones
export const sendNotifications = async () => {
  console.log("Revisando turnos para enviar alertas...");
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Medianoche de hoy
  const tomorrow = new Date(now);

  tomorrow.setDate(tomorrow.getDate() + 1);
  //Medianoche de ayer
  tomorrow.setHours(0, 0, 0, 0); // se debe ajustar hora tambien ya que la fecha de BD tiene formato "YYYY/MM/DD y la query tiene en cuenta minutos y hora tambien"

  // Convierte las fechas a formato "YYYY-MM-DD" (sin horas)
  const formattedNow = now.toISOString().split("T")[0]; // Ejemplo: "2024-12-24"
  const formattedTomorrow = tomorrow.toISOString().split("T")[0]; // Ejemplo: "2024-12-22"

  try {
    const turnos = await Turno.find({
      date: { $gte: formattedNow, $lte: formattedTomorrow },
      isNotifications: true,
      sendNotifications: false,
    });

    // Enviar alertas por correo
    for (const turno of turnos) {
      // const emailContent = await generateEmailContent(
      //   turno.name,
      //   turno.nameDog,
      //   turno.date,
      //   turno.time
      // );

      const {email} = await Cliente.findById({ _id: turno.Client });

      console.log(email)
      if (email) {
        const mailOptions = {
          from: "pymestiendavirtual@gmail.com",
          to: `${email}`, // Cambiar al correo del cliente en producción
          subject: "Recordatorio de turno",
          //text: emailContent
          text: `Hola ${turno.name}, recuerda que tienes un turno agendado para ${turno.nameDog} el día ${turno.date} a las ${turno.time}`,
        };
        await transporter.sendMail(mailOptions);
        turno.sendNotifications=true
        await turno.save();
      }
    }
  } catch (err) {
    console.error("Error al enviar alertas:", err);
  }
};

// Configurar el cron job programado

//este es lo que activa la notificacion automatica, para quer se corra hay que descomentarla
//mañanse debeir an
cron.schedule("0 08 * * *", sendNotifications);


//* * * * * ejecuta el cron cada minuto
//0 0 * * * ejecuta el cron cada dia a las 00:00
//0 9 * * * ejecuta el cron cada dia a las 21:09
//0 10 * * * ejecuta el cron cada dia a las 10:00+

//0 → En el minuto 0.
//10 → En la hora 10 (10 AM en formato de 24 horas).
//* → Cualquier día del mes.
//* → Cualquier mes.
//* → Cualquier día de la semana