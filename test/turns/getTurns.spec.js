import app from "../../index.js";
import request from "supertest";
import Turno from "../../models/turno.js";
import { configDatabase, cleanUp } from "../config.js";

beforeAll(configDatabase);
afterAll(cleanUp);

const verifyMissingFields = async (filter) => {
  const requiredFields = [
    "_id",
    "name",
    "nameDog",
    "phone",
    "date",
    "notesTurn",
    "time",
    "idDog",
    "Company",
    "Client",
  ];

  const query = {
    ...filter,
    $or: requiredFields.map((field) => ({ [field]: { $exists: false } })),
  };

  return await Turno.find(query, null, { lean: true });
};

describe("GET /api/getTurnos/:idCompany", () => {
  const idCompany = "66872b500945d93a4c124c11";
  test("should return a 200 status and correct data structure", async () => {
    const response = await request(app).get(`/api/getTurnos/${idCompany}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("turnos");
    expect(Array.isArray(response.body.turnos)).toBe(true);
    const missingFields = await verifyMissingFields({ Company: idCompany });
    expect(missingFields.length).toBe(0);
  });
});


