import request from "supertest"
import app from "../../index.js";
import { configDatabase, cleanUp } from "../config.js";

beforeAll(configDatabase);
afterAll(cleanUp);

describe("GET /api/perro/:idMascota", () => {
    const idMascota="6283a77146538c12e4bc0915"
    test("should return a 200 status code if the pet exists", async () => {
        const response = await request(app).get(`/api/perro/${idMascota}`)
        expect(response.status).toBe(200)
    })
    
    // it("should return a 404 status code if the pet does not exist", async () => {
    //     const response = await request("http://localhost:3000").get("/api/perro/100")
    //     expect(response.status).toBe(404)
    // })

})
