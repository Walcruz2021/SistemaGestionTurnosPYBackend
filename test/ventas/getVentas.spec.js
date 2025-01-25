import app from "../../index.js";
import request from "supertest";
import Venta from "../../models/venta.js"; // Importa el modelo completo
import { configDatabase, cleanUp } from "../config.js";


// Configurar la base de datos antes de todas las pruebas
beforeAll(configDatabase);

// Limpiar la base de datos y cerrar conexiones después de todas las pruebas
afterAll(cleanUp);

const verifyMissingFields = async (filter) => {
  const requiredFields = [
    "_id",
    "idTurno",
    "date",
    "valorServ",
    "notesTurn",
    "tipoServ",
    "transferencia",
    "efectivo",
    "tarjeta",
    "año",
    "mes",
    "idCompany",
    "client",
    "Dog",
  ];

  const query = {
    ...filter,
    $or: requiredFields.map((field) => ({ [field]: { $exists: false } })),
  };
  return Venta.find(query, null, { lean: true });
};

describe("GET /api/listVentas", () => {
  test("should return a 200 status and correct data structure", async () => {
    const response = await request(app).get("/api/listVentas");

    // Verificar que el código de estado sea 200
    expect(response.status).toBe(200);

    // Verificar que la respuesta sea un objeto con la propiedad 'ventas'
    expect(response.body).toHaveProperty("ventas");
    expect(Array.isArray(response.body.ventas)).toBe(true);

    // Usar Mongoose para verificar que no haya documentos con campos faltantes
    const missingFields = await verifyMissingFields({});

    // Esperar que no haya resultados con campos faltantes
    expect(missingFields.length).toBe(0);
  });
});

describe("GET /api/ventasxAnio/:idCompany", () => {
  const idCompany = "66872b500945d93a4c124c11";

  test("should return a 200 status and correct data structure", async () => {
    //const response = await request(app).get(`/api/ventasxAnio/${idCompany}`);

    const response = await request(app)
      .get(`/api/ventasxAnio/${idCompany}`)
      .send({ anio: 2024 }); // Enviar el año en el cuerpo

    // Verificar que el código de estado sea 200
    expect(response.status).toBe(200);

    // Verificar que la respuesta sea un objeto con la propiedad 'ventas'
    expect(response.body).toHaveProperty("ventas");
    expect(Array.isArray(response.body.ventas)).toBe(true);

    // Usar Mongoose para verificar que no haya documentos con campos faltantes

    const missingFields = await verifyMissingFields({ idCompany });

    // Esperar que no haya resultados con campos faltantes
    expect(missingFields.length).toBe(0);
  });
});

describe("GET /api/listVentas/:idVta", () => {
  const idVta = "66895d7346d53c2c5c82ad75";
  test("should return a 200 status and correct data structure", async () => {
    const response = await request(app).get(`/api/listVentas/${idVta}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("ventaID");
    expect(typeof response.body.ventaID).toBe("object");

    const missingFields = await verifyMissingFields({ _id:idVta });
    expect(missingFields.length).toBe(0);
  });
});

describe("GET /api/ventaCli/:idDog", () => {
  const idDog = "66895a3f46d53c2c5c82ad66";
  test("should return a 200 status and correct data structure", async () => {
    const response = await request(app).get(`/api/ventaCli/${idDog}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("vta");
    expect(Array.isArray(response.body.vta)).toBe(true);
    const missingFields = await verifyMissingFields({ Dog:idDog });
    expect(missingFields.length).toBe(0);
  });
});


// describe('GET /api/listVentas', () => {
//   it('should return 404 when there are no ventas', async () => {
//     // Mockear el método find del modelo Venta
//     VentaModel.Venta.find = jest.fn().mockResolvedValue([]); // Simula que no se encuentran ventas

//     const response = await request(app).get('/api/listVentas');

//     // Verificar que el código de estado sea 404
//     expect(response.status).toBe(404);

//     // Verificar que el mensaje de error sea el esperado
//     expect(response.body).toHaveProperty('message');
//     expect(response.body.message).toBe('Ventas not found');
//   });
// });
