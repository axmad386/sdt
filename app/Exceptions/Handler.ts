import ApiException from "./ApiException";
import { Handler as ExceptionHandler, HttpException } from "@lunoxjs/core";
import { ValidationException } from "@lunoxjs/zod";
import { EntityNotFoundError } from "typeorm";
import ApiResponse from "../Http/Support/ApiResponse";

class Handler extends ExceptionHandler {
  protected dontReport = [ValidationException];

  register() {
    this.reportable(ApiException, (e) => {
      if (e.status >= 500) {
        console.log("API Error", e);
      }
    });

    this.renderable(ValidationException, (e) => {
      return ApiResponse.error("Unprocessable Entity", 422, e.errors());
    });

    this.renderable(ApiException, (e) => {
      return ApiResponse.error(e.message, e.status);
    });

    this.renderable(EntityNotFoundError, () => {
      return ApiResponse.error("Record is not found in our database", 404);
    });

    this.renderable(HttpException, (e) => {
      return ApiResponse.error(e.message, e.getStatusCode());
    });

    this.renderable(Error, (e) => {
      return ApiResponse.error(
        env("APP_DEBUG") ? e.message : "Server Error",
        500,
        {},
        env("APP_DEBUG") ? e.stack : undefined,
      );
    });
  }
}

export default Handler;
