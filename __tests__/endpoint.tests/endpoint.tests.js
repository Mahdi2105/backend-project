const app = require("../../db/app.js");
const data = require("../../db/data/test-data");
const db = require("../../db/connection");
const seed = require("../../db/seeds/seed.js");
const request = require("supertest");
const endpointsJson = require("../../endpoints.json");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET:200 sends an array of endpoints to the client", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const responseLength = Object.keys(response.body.endpoints).length;
        expect(responseLength).toBe(Object.keys(endpointsJson).length);
      });
  });

  test("GET:200 each endpoint should include some required attributes", () => {
    Object.values(endpointsJson).forEach((endpoint) => {
      expect(endpoint.hasOwnProperty("description")).toBe(true);
      expect(endpoint.hasOwnProperty("queries")).toBe(true);
      expect(endpoint.hasOwnProperty("format")).toBe(true);
      expect(endpoint.hasOwnProperty("exampleResponse")).toBe(true);
    });
  });
});
