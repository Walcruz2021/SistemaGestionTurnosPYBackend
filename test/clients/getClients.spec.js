import app from "../../index.js";
import request from "supertest";
import Client from "../../models/cliente.js";
import { configDatabase, cleanUp } from "../config.js";
import { expect } from "@jest/globals";

beforeAll(configDatabase);
afterAll(cleanUp);

const verifyMissingFields = async (filter) => {
  const formatClient = [
    "turnos",
    "pedidos",
    "perros",
    "status",
    "userLogin",
    "name",
    "phone",
    "address",
    "notesCli",
    "Company",
    "address"
  ];

  const query = {
    ...filter,
    $or: formatClient.map((field) => ({ [field]: { $exists: false } })),
  };

  return Client.find(query, null, { lean: true });
};

describe("GET /api/listClientsCompany/:idCompany", () => {
  const idCompany = "66872b3a0945d93a4c124c05";
  test("should return a 200 status and correct data structure", async () => {
    const response = await request(app).get(
      `/api/listClientsCompany/${idCompany}`
    );
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.clientes)).toBe(true);
    expect(response.body).toHaveProperty("clientes");
    const missingFields = await verifyMissingFields({Company:idCompany});
    expect(missingFields.length).toBe(0);
  });
});

describe("GET /api/listClients/:idClient", () => {
    const idClient = "6688546078ba9a1a30dddf79";
    test("should return a 200 status and correct data structure", async () => {
      const response = await request(app).get(
        `/api/listClients/${idClient}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("findClient");
      const missingFields = await verifyMissingFields({_id:idClient});
      expect(missingFields.length).toBe(0);
    });
  });
