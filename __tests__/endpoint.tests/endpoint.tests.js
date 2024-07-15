const app = require("../../db/app.js");
const data = require("../../db/data/test-data");
const db = require("../../db/connection");
const seed = require("../../db/seeds/seed.js");
const request = require("supertest");

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
