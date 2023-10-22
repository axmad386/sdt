import TestCase from "../TestCase";
import { describe, test, expect } from "vitest";
import { getAllTimezones } from "countries-and-timezones";

TestCase.make();

describe("Timezone Api Test", () => {
  test("can get list of country (timezone)", async () => {
    const res = await agent.get("/country").expect(200);
    expect(res.body.data).toMatchObject(Object.keys(getAllTimezones()));
  });
});
