
// import request from "supertest";
// import app from "../index.js"; // Ajusta el path según la estructura de tu proyecto

const request = require("supertest");
const app = require("../index.js");


describe("Test API routes", () => {
  it("should return a list of items", async () => {
    const response = await request(app).get("/api/items");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});