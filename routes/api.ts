import { Route } from "@lunoxjs/core/facades";
import TimezoneController from "../app/Http/Controllers/TimezoneController";
import UserController from "../app/Http/Controllers/UserController";

Route.get("/country", [TimezoneController, "getCountries"]);
Route.prefix("/user").group(() => {
  Route.get("/", [UserController, "list"]);
  Route.post("/", [UserController, "create"]);
  Route.patch("/:id", [UserController, "update"]);
  Route.delete("/:id", [UserController, "delete"]);
});
