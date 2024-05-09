import { Controller, Request } from "@lunoxjs/core";
import { z } from "zod";
import Timezone from "countries-and-timezones";
import { DB } from "@lunoxjs/typeorm";
import User from "../../Model/User";
import ApiResponse from "../Support/ApiResponse";
import { Not } from "typeorm";
import Broadcast, { BroadcastStatus } from "../../Model/Broadcast";
import dayjs from "dayjs";

class UserController extends Controller {
  async list() {
    return ApiResponse.success(await DB.use(User).find());
  }
  async create(req: Request) {
    const { first_name, last_name, birthday_date, email, location } =
      await req.validate({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        birthday_date: z.date({ coerce: true }),
        email: z.string().email(),
        location: z
          .string()
          .refine(
            (val) => Object.keys(Timezone.getAllTimezones()).includes(val),
            { message: "Invalid Location, see api/country" },
          ),
      });
    if (await DB.use(User).exist({ where: { email } }))
      abort(400, "Email already exists");

    const utcOffset = dayjs().tz(location).utcOffset();
    const {
      identifiers: [{ id }],
    } = await DB.use(User).insert({
      first_name,
      last_name,
      birthday: birthday_date,
      utcOffset,
      email,
      location,
    });

    const newUser = await DB.use(User).findOneByOrFail({ id });

    return ApiResponse.success(newUser, "User created", 201);
  }

  async delete(_: Request, id: number) {
    const user = await DB.use(User).findOneByOrFail({ id });
    await DB.use(User).remove(user);
    return ApiResponse.success(user, "User deleted", 200);
  }

  async update(req: Request, id: number) {
    const { first_name, last_name, birthday_date, email, location } =
      await req.validate({
        first_name: z.string().min(1).optional(),
        last_name: z.string().min(1).optional(),
        birthday_date: z.date({ coerce: true }).optional(),
        email: z.string().email().optional(),
        location: z
          .string()
          .refine(
            (val) => Object.keys(Timezone.getAllTimezones()).includes(val),
            { message: "Invalid Location, see api/country" },
          )
          .optional(),
      });
    const user = await DB.use(User).findOneByOrFail({ id });
    if (
      email &&
      (await DB.use(User).exist({
        where: {
          email,
          id: Not(id),
        },
      }))
    )
      abort(400, "Email already exists");

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (birthday_date) user.birthday = birthday_date;
    if (email) user.email = email;
    if (location) {
      user.location = location;
      user.utcOffset = dayjs().tz(location).utcOffset();
    }
    await DB.use(User).save(user);

    // remove all pending broadcast so they are not sent
    // scheduler will try send them again with correct date
    await DB.use(Broadcast).delete({
      user_id: user.id,
      status: BroadcastStatus.SENDING,
    });
    return ApiResponse.success(user, "User updated", 200);
  }
}

export default UserController;
