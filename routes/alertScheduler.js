const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Turno = require("../models/turno"); // Asegúrate de que la ruta al modelo es correcta


// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: "gmail", // Puedes usar otro proveedor
    auth: {
      user: process.env.EMAIL_NOTIFICATIONS, // Cambia por tu correo
      pass: process.env.PASSWORD_EMAIL_NOTIFICATIONS, // Cambia por tu contraseña o usa un token seguro
    },
    // auth: {
    //     user: "pymestiendavirtual@gmail.com", // Cambia por tu correo
    //     pass: "crce bfea flhl lmyt", // Cambia por tu contraseña o usa un token seguro
    //   },
  //se debe dejar la linea cuando se hagan pruebas locales
  tls: {
    rejectUnauthorized: false, // Ignorar certificados no confiables. Se debe scar esta linea cuando estemos en produccion
  },
});

// Programar un cron job que se ejecute todos los días a las 8 AM
cron.schedule("* * * * *", async () => {
  console.log("Revisando turnos para enviar alertas...");
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1); // Obtener el día siguiente

  try {
    const turnos = await Turno.find({
      //   date: { $gte: now, $lt: tomorrow },
      alertSent: false,
    });

    // Enviar alertas por correo
    for (const turno of turnos) {
      const mailOptions = {
        from: "pymestiendavirtual@gmail.com",
        to: "walcruz1988.21@gmail.com", // Supongamos que este campo guarda el correo del cliente
        subject: "Recordatorio de turno",
        text: `Hola ${turno.name}, recuerda que tienes un turno agendado para ${turno.nameDog} el día ${turno.date} a las ${turno.time}.`,
      };

      await transporter.sendMail(mailOptions);
      turno.alertSent = true; // Actualizar el estado de la alerta
      await turno.save();
    }

    console.log("Alertas enviadas exitosamente.");
  } catch (err) {
    console.error("Error al enviar alertas:", err);
  }
});
