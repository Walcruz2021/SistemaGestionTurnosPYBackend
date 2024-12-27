import app from "../../index.js";
import request from "supertest";
import Turno from "../../models/turno.js";
import { configDatabase, cleanUp } from "../config.js";

beforeAll(configDatabase);
afterAll(cleanUp);

describe("POST /api/turno", () => {
    const dataTurn = {
      name: "cliente empresa prueba 1b",
      nameDog: "ratriruis",
      phone: "1234567890",
      date: "2024-12-25", 
      notesTurn: "Turno Test Jest",
      time: "14:30",
      idDog: "668856c278ba9a1a30dddf93", 
      Company: "66872b500945d93a4c124c11",
      Client: "6688546078ba9a1a30dddf79", 
    }
    test("should return a 200 status and create Turn", async () => {
      const response = await request(app)
      .post(`/api/turno`)
      .send(dataTurn);
      expect(response.status).toBe(200);
    });
  });
  