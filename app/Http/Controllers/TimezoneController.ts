import { Controller } from "@lunoxjs/core";
import Timezone from "countries-and-timezones";
import ApiResponse from "../Support/ApiResponse";

class TimezoneController extends Controller {
  async getCountries() {
    return ApiResponse.success(Object.keys(Timezone.getAllTimezones()));
  }
}

export default TimezoneController;
