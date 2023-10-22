import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

import { beforeAll, describe, expect, test } from "vitest";
import { getAllTimezones } from "countries-and-timezones";

describe("Dayjs Test", () => {
  beforeAll(() => {
    dayjs.extend(utc);
    dayjs.extend(tz);
  });
  test("can compare date in utc mode and randome timezone", () => {
    const timezones = Object.keys(getAllTimezones());
    const randomTimezone =
      timezones[Math.floor(Math.random() * timezones.length)];
    const utcOffset = dayjs().tz(randomTimezone).utcOffset();
    const timezoneDate = dayjs()
      .tz(randomTimezone)
      .subtract(utcOffset || 0, "minutes")
      .format("YYYY-MM-DD HH");
    const utcDate = dayjs().utc().format("YYYY-MM-DD HH");
    expect(timezoneDate == utcDate).toBe(true);
  });
});
