const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Turno = require("../models/turno"); // Asegúrate de que la ruta al modelo es correcta
const{
    EMAIL_NOTIFICATIONS,
    PASSWORD_EMAIL_NOTIFICATIONS
}=process.env


// Configuración del transportador de correo
const transporter = nodemailer.createTransport({

  service: "gmail", // Puedes usar otro proveedor
  auth: {
    user: `${EMAIL_NOTIFICATIONS}`, // Cambia por tu correo
    pass: `${PASSWORD_EMAIL_NOTIFICATIONS}`, // Cambia por tu contraseña o usa un token seguro
  },
});

// Programar un cron job que se ejecute todos los días a las 8 AM
cron.schedule("* * * * *", async () => {
  console.log("Revisando turnos para enviar alertas...");
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1); // Obtener el día siguiente

  try {
    // Buscar turnos para el día siguiente
    const turnos = await Turno.find({
      date: { $gte: now, $lt: tomorrow },
      alertSent: false,
    });
console.log(turnos)
    // Enviar alertas por correo
    // for (const turno of turnos) {
       
    //   const mailOptions = {
    //     from: "pymestiendavirtual@gmail.com",
    //     to: "walcruz1988.21@gmail.com", // Supongamos que este campo guarda el correo del cliente
    //     subject: "Recordatorio de turno",
    //     text: `Hola ${turno.name}, recuerda que tienes un turno agendado para ${turno.nameDog} el día ${turno.date} a las ${turno.time}.`,
    //   };

    //   await transporter.sendMail(mailOptions);
    //   console.log(turno)
    //   turno.alertSent = true; // Actualizar el estado de la alerta
    //   await turno.save();
    // }

    console.log("Alertas enviadas exitosamente.");
  } catch (err) {
    console.error("Error al enviar alertas:", err);
  }
});
