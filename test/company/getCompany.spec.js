import app from "../../index.js";
import request from "supertest";
import Company from "../../models/company.js";
import { configDatabase, cleanUp } from "../config.js";
import { expect } from "@jest/globals";

beforeAll(configDatabase);
afterAll(cleanUp);

const verifyMissingFields = async (filter) => {
  const formatCompany = [
    "nameCompany",
    "address",
    "cuit",
    "province",
    "country",
  ];

  const query = {
    ...filter,
    $or: formatCompany.map((field) => ({ [field]: { $exists: false } })),
  };
  return Company.find(query, null, { lean: true });
}


describe("GET /api/getCompany/:idCompany", () => {
  const idCompany = "66872b500945d93a4c124c11";
  test("should return a 200 status and correct data structure", async () => {
    const response = await request(app).get(`/api/getCompany/${idCompany}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("findCompany");
    const missingFields = await verifyMissingFields();
    expect(missingFields.length).toBe(0);

  });
});

describe("GET /api/validationCompanyExist/:email", () => {
  const email = "walcruz1988.21@gmail.com";
  test("should return a 200 status and correct data structure", async () => {
    const response = await request(app).get(
      `/api/validationCompanyExist/${email}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("companies");
    expect(Array.isArray(response.body.companies)).toBe(true);
    const missingFields = await verifyMissingFields();
    expect(missingFields.length).toBe(0);
  });
});

//ESTE POST ES EL BACKUP QUE SE GUARDA YA QUE CUANDO SE LO AGREGA NO FUNCIONA EL POST SE LO GUARDA POR LAS DUDAS Y SE COMEINZA A TRABAJAR CON LOS GETS

// import app from "../../index.js";
// import request from "supertest";
// import Turno from "../../models/turno.js";
// import { configDatabase, cleanUp } from "../config.js";

// beforeAll(configDatabase); // Configura la base de datos antes de todos los tests
// afterAll(cleanUp); // Limpia la base de datos después de todos los tests

// describe("POST /api/turno", () => {
//   const dataTurn = {
//     name: "cliente empresa prueba 1b",
//     nameDog: "ratriruis",
//     phone: "1234567890",
//     date: "2024-12-25",
//     notesTurn: "Turno Test Jest",
//     time: "14:30",
//     idDog: "668856c278ba9a1a30dddf93", // Verifica que este ID exista
//     Company: "66872b500945d93a4c124c11", // Verifica que este ID exista
//     Client: "6688546078ba9a1a30dddf79", // Verifica que este ID exista
//   };

//   test("should return a 200 status and create a Turn", async () => {
//     const response = await request(app)
//       .post(`/api/turno`)
//       .send(dataTurn);

//     // Verifica el código de estado
//     expect(response.status).toBe(200);

//     // Verifica el cuerpo de la respuesta
//     expect(response.body).toHaveProperty("_id");
//     expect(response.body.name).toBe(dataTurn.name);
//     expect(response.body.nameDog).toBe(dataTurn.nameDog);
//     expect(response.body.phone).toBe(dataTurn.phone);

//     // Verifica que el turno fue creado en la base de datos
//     const turno = await Turno.findById(response.body._id);
//     expect(turno).not.toBeNull();
//     expect(turno.name).toBe(dataTurn.name);
//     expect(turno.date).toBe(dataTurn.date);
//   });
// });
