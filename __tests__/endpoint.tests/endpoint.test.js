const app = require("../../db/app.js");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");
const request = require("supertest");
const fs = require("fs/promises");
const path = require("path");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api", () => {
  test("GET:200 sends an array of endpoints to the client", async () => {
    const filePath = path.join(__dirname, "../../endpoints.json");
    const endpointCount = await fs
      .readFile(filePath, "utf-8")
      .then((endpoints) => {
        const parsedEndpoints = JSON.parse(endpoints);
        return Object.keys(parsedEndpoints).length;
      });
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const responseLength = Object.keys(response.body.endpoints).length;
        expect(responseLength).toBe(endpointCount);
      });
  });

  test("GET:200 each endpoint should include some required attributes", async () => {
    const filePath = path.join(__dirname, "../../endpoints.json");
    return fs.readFile(filePath, "utf-8").then((endpoints) => {
      const parsedEndpoints = JSON.parse(endpoints);
      Object.values(parsedEndpoints).forEach((endpoint) => {
        expect(endpoint.hasOwnProperty("description")).toBe(true);
        expect(endpoint.hasOwnProperty("queries")).toBe(true);
        expect(endpoint.hasOwnProperty("format")).toBe(true);
        expect(endpoint.hasOwnProperty("exampleResponse")).toBe(true);
      });
    });
  });
});

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

describe("articles", () => {
  describe("GET all articles", () => {
    test("GET:200 sends an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBe(5);
          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });

    test("GET:200 sends an array of articles without bodies", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(5);
          body.articles.forEach((article) => {
            expect(article).not.toHaveProperty("body");
          });
        });
    });

    test("GET:200 all articles have required properties", () => {
      const properties = [
        "article_id",
        "author",
        "title",
        "topic",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count",
      ];
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            properties.forEach((prop) => {
              expect(prop in article).toBe(true);
            });
          });
        });
    });
  });

  describe("GET articles by article_id", () => {
    test("GET:200 sends an article with entered id to the client", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body.article.article_id).toBe(1);
        });
    });

    test("GET:404 sends an error message for a non-existant id", () => {
      return request(app)
        .get("/api/articles/3487")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });

    test("GET:400 sends an error message when the passed article_id is not a number", () => {
      return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });

  describe("GET all comments from article_id", () => {
    test("GET:200 returns all comments based on article_id and has relevant fields", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(2);
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });

    test("GET:200 returns empty array if article exists but no comments are linked", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });

    test("GET:404 returns error if article_id does not exist", () => {
      return request(app)
        .get("/api/articles/100/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    test("GET:400 returns error if article_id is not a number", () => {
      return request(app)
        .get("/api/articles/not-a-number/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("POST comments by article_id", () => {
    test("POST: 201 returns the posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "lurker",
          body: "Something really interesting",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: expect.any(Number),
            body: "Something really interesting",
            article_id: 1,
            author: "lurker",
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });

    test.only("POST: 201 ignores extra properties", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "lurker",
          body: "Something really interesting",
          age: 27,
          hobbies: "Hiking",
        })
        .expect(201)
        .then(({ body }) => {
          console.log(body.comment);
          expect(body.comment).toEqual({
            comment_id: expect.any(Number),
            body: "Something really interesting",
            article_id: 1,
            author: "lurker",
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });

    test("POST:404 returns error if article_id does not exist", () => {
      return request(app)
        .post("/api/articles/100/comments")
        .send({
          username: "lurker",
          body: "Something really interesting",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    test("POST:400 returns error if article_id is not a number", () => {
      return request(app)
        .post("/api/articles/not-a-number/comments")
        .send({
          username: "lurker",
          body: "Something really interesting",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("POST:400 returns error if passed an empty object", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("POST:400 returns error if username or body is not entered", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          body: "Something really interesting",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("POST:400 returns error if username does not exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "Mahdi",
          body: "Something really interesting",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});
