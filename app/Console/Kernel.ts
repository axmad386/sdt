import { Kernel as ConsoleKernel } from "@lunoxjs/core/console";
import { Schedule } from "@lunoxjs/event";
import { HasSchedule } from "@lunoxjs/event/contracts";
import ScheduleBroadcastBirthday from "../Jobs/ScheduleBroadcastBirthday";

class Kernel extends ConsoleKernel implements HasSchedule {
  protected async commands() {
    await this.load(base_path("app/Console/Command"));
  }
  public schedule(schedule: Schedule): void {
    // run every hour at minute 0
    schedule.job(new ScheduleBroadcastBirthday()).cron("0 0 * * * *");
  }
}

export default Kernel;
