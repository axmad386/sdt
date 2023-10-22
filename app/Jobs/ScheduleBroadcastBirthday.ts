import { Dispatchable } from "@lunoxjs/event";
import { DB } from "@lunoxjs/typeorm";
import User from "../Model/User";
import dayjs from "dayjs";
import SendMail from "./SendMail";
import Broadcast, { BroadCastType, BroadcastStatus } from "../Model/Broadcast";

class ScheduleBroadcastBirthday extends Dispatchable {
  protected shouldQueue = true;
  protected metaUrl = import.meta.url;
  constructor() {
    super();
  }
  async handle(): Promise<void> {
    // date can be 2 days, because different utcOffset
    const utcDate1 = dayjs().utc().format("YYYY-MM-DD");
    const utcDate2 = dayjs().utc().add(1, "day").format("YYYY-MM-DD");
    const users = await DB.use(User).find({
      where: [
        {
          birthday: utcDate1 as any,
        },

        {
          birthday: utcDate2 as any,
        },
      ],
    });

    for (const user of users) {
      // send birthday mail only when Month Date and hour match
      if (
        dayjs(`${user.birthday} ${config("broadcast.birthday")}`)
          .tz(user.location)
          .subtract(user.utcOffset, "minutes")
          .format("MM-DD HH") == dayjs().utc().format("MM-DD HH")
      ) {
        const scheduled_at = new Date();
        const {
          identifiers: [{ id }],
        } = await DB.use(Broadcast).insert({
          user_id: user.id,
          type: BroadCastType.BIRTHDAY,
          status: BroadcastStatus.SENDING,
          scheduled_at,
        });
        const newBroadcast = await DB.use(Broadcast).findOneByOrFail({ id });
        await SendMail.dispatch(
          user,
          `Hey, ${user.full_name} it's your birthday`,
          newBroadcast,
        );
      }
    }
  }
}
export default ScheduleBroadcastBirthday;
