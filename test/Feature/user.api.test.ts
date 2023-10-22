import TestCase from "../TestCase";
import { describe, expect, test } from "vitest";

TestCase.make();

describe("User Api Test", () => {
  test("fail create user with invalid data", async () => {
    await agent.post("/user").send({}).expect(422);
    agent
      .post("/user")
      .send({
        first_name: "John",
        last_name: "Smith",
        birthday_date: "2022-20-22",
        email: "john@mailcom",
        location: "Jakarta",
      })
      .expect(422)
      .then((res) => {
        expect(res.body.errors["location"][0]).toContain("Invalid Location");
        expect(res.body.errors["birthday_date"][0]).toContain("Invalid date");
        expect(res.body.errors["email"][0]).toContain("Invalid email");
      });
  });
  test("success create user with valid data", async () => {
    agent
      .post("/user")
      .send({
        first_name: "John",
        last_name: "Smith",
        birthday_date: "2022-02-22",
        email: "john@mail.com",
        location: "Asia/Jakarta",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.data.first_name).toBe("John");
        expect(res.body.data.utcOffset).toBe(420);
      });
  });
  test("can get list of user", async () => {
    agent
      .get("/user")
      .expect(200)
      .then((res) => {
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].first_name).toBe("John");
        expect(res.body.data[0].utcOffset).toBe(420);
      });
  });
  test("can update user data", async () => {
    const res = await agent.get("/user").expect(200);
    console.log(res.body.data[0]);
    const resUpdate = await agent
      .patch("/user/" + res.body.data[0].id)
      .send({
        location: "Australia/Melbourne",
      })
      .expect(200);

    expect(resUpdate.body.data.first_name).toBe("John");
    expect(resUpdate.body.data.utcOffset).toBe(660);
  });
  test("can delete user data", async () => {
    const res = await agent.get("/user").expect(200);
    agent
      .delete("/user/" + res.body.data[0].id)
      .expect(200)
      .then((res) => {
        expect(res.body.data.first_name).toBe("John");
        expect(res.body.data.utcOffset).toBe(660);
      });
    agent
      .get("/user")
      .expect(200)
      .then((res) => expect(res.body.data.length).toBe(0));
  });
});
