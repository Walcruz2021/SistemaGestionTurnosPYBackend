import request from "supertest";
import app from "../../index.js";
import { configDatabase, cleanUp } from "../config.js";
import Mascota from "../../models/perro.js";


beforeAll(configDatabase);
afterAll(cleanUp);

const verifyMissingFields = async (filter) => {
  const formatPet = ["nameDog", "raza", "tamaño", "notaP", "status"];
  const query = {
    ...filter,
    $or: formatPet.map((field) => ({ [field]: { $exists: false } })),
  };

  return await Mascota.find(query, null, { lean: true });
};

describe("GET /api/perro/:idMascota", () => {
  const idMascota = "668856c278ba9a1a30dddf93";
  test("should return a 200 status code if the pet exists", async () => {
    const response = await request(app).get(`/api/perro/${idMascota}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("findPets");
    //expect(Array.isArray(response.body)).toBe(true);
    const missingFields = await verifyMissingFields({ _id: idMascota });
    expect(missingFields.length).toBe(0);
});


  // it("should return a 404 status code if the pet does not exist", async () => {
  //     const response = await request("http://localhost:3000").get("/api/perro/100")
  //     expect(response.status).toBe(404)
  // })
});
