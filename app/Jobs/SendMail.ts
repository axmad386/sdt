import { Dispatchable } from "@lunoxjs/event";
import User from "../Model/User";
import Broadcast, { BroadcastStatus } from "../Model/Broadcast";
import { DB } from "@lunoxjs/typeorm";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";

class SendMail extends Dispatchable {
  protected shouldQueue = true;
  protected metaUrl = import.meta.url;
  displayName(): string {
    return base_path("app/Jobs/SendMail.js");
  }
  tries = 10;
  constructor(
    public user: User,
    public message: string,
    public broadcast: Broadcast,
  ) {
    super();
  }
  async handle(): Promise<void> {
    // skip if broadcast is not valid
    const broadcast = await DB.use(Broadcast).findOne({
      where: {
        id: this.broadcast.id,
        status: BroadcastStatus.SENDING,
      },
    });
    if (!broadcast) return;
    await axios.post(
      "https://email-service.digitalenvision.com.au/send-email",
      {
        email: this.user.email,
        message: this.message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    broadcast.status = BroadcastStatus.SENT;
    await DB.use(Broadcast).save(broadcast);
  }

  async failed(e: Error): Promise<void> {
    this.broadcast.status = BroadcastStatus.FAILED;
    await DB.use(Broadcast).save(this.broadcast);

    if (e instanceof AxiosError) {
      const scheduled_at = dayjs().add(30, "minutes").toDate();
      //try send another email after 30 minutes
      const {
        identifiers: [{ id }],
      } = await DB.use(Broadcast).insert({
        user_id: this.user.id,
        type: this.broadcast.type,
        status: BroadcastStatus.SENDING,
        scheduled_at,
      });
      const newBroadcast = await DB.use(Broadcast).findOneByOrFail({ id });
      await SendMail.dispatch(this.user, this.message, newBroadcast, {
        delay: scheduled_at,
      });
    }
  }
}
export default SendMail;
