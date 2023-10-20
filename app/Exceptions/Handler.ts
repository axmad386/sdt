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

    this.renderable(ValidationException, (e, req) => {
      if (req.wantsJson()) {
        return ApiResponse.error("Unprocessable Entity", 422, e.errors());
      }

      return back().withInput({ except: "password" }).with({
        message: e.message,
        errors: e.errors(),
      });
    });

    this.renderable(ApiException, (e) => {
      return ApiResponse.error(e.message, e.status);
    });

    this.renderable(EntityNotFoundError, (e, req) => {
      if (req.wantsJson()) {
        return ApiResponse.error("Record is not found in our database", 404);
      } else {
        return view("_error", {
          message: "Record not found in our database",
          code: 404,
        });
      }
    });

    this.renderable(HttpException, (e, req) => {
      if (req.wantsJson()) {
        return ApiResponse.error(e.message, e.getStatusCode());
      }

      // if auth attempt fail, redirect it back
      if (e.getStatusCode() == 401) {
        return redirect("/login")
          .withInput({ except: "password" })
          .with({ message: e.message });
      }

      return view("_error", { message: e.message, code: e.getStatusCode() });
    });

    this.renderable(Error, (e, req) => {
      if (req.wantsJson()) {
        return ApiResponse.error(
          env("APP_DEBUG") ? e.message : "Server Error",
          500,
          {},
          env("APP_DEBUG") ? e.stack : undefined,
        );
      }
      return view("_error", {
        message: env("APP_DEBUG") ? e.message : "Server Error",
        code: 500,
        stack: env("APP_DEBUG") ? e.stack : null,
      });
    });
  }
}

export default Handler;
