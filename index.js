import "dotenv/config"; //importar y configurar dotenv

import express from "express"; // importar express
import morgan from "morgan"; //importar morgar
import helmet from "helmet"; //importar helmet
import cors from "cors"; //importar cors

import { createTransport } from "nodemailer"; //se importa la funcion "createTransport" del modulo "nodemailer"
//from 'nodemailer': Esto indica que la función createTransport se está importando desde el módulo 'nodemailer'.

const app = express();

//configuracion de middeleware

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

//Este código define una función asincrónica enviarEmail que utiliza nodemailer para enviar correos electrónicos. Toma información como el asunto, el contenido y la dirección de correo electrónico del destinatario, y utiliza la configuración del servidor SMTP de Gmail para enviar el correo.

async function enviarEmail({ subject, text, toEmail }) {
  const config = {
    host: "smtp.gmail.com", //ejemplog
    port: 587,
    auth: {
      user: process.env.usermail,
      pass: process.env.passwordmail,
    },
  };

  const transporter = createTransport(config);

  const message = {
    from: process.env.usermail,
    to: toEmail,
    subject,
    text,
  };

  return await transporter.sendMail(message);
}

//este código configura una ruta POST en una aplicación Express que espera recibir solicitudes en la raíz. Cuando se recibe una solicitud POST, la aplicación intenta enviar un correo electrónico utilizando la función enviarEmail. Si el envío es exitoso, devuelve un objeto JSON con información sobre el correo electrónico enviado. Si ocurre un error, imprime el error en la consola y envía una respuesta simple con la palabra 'error'.

app.post("/", async (req, res) => {
  try {
    const sentInfo = await enviarEmail(req.body);

    res.status(200).json(sentInfo);
  } catch (error) {
    console.log(error);

    res.send("error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});