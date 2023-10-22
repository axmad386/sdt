import { ServiceProvider } from "@lunoxjs/core";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import dayjs from "dayjs";

class AppServiceProvider extends ServiceProvider {
  /**
   * Register any application services.
   */
  public async register() {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    this.app.instance("version", await this.getVersion());
  }

  /**
   * Bootstrap any application services
   */
  public async boot() {
    //
  }

  /**
   * Get app and framework version
   */
  private async getVersion() {
    const {
      version,
      dependencies: { "@lunoxjs/core": lunox },
    } = await import("../../package.json");

    return {
      app: version,
      framework: lunox.replace("^", ""),
    };
  }
}

export default AppServiceProvider;
