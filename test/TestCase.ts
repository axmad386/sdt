import type { Kernel } from "@lunoxjs/core";
import app from "../bootstrap/app";
import { BaseTestCase } from "@lunoxjs/test";
import { DB } from "@lunoxjs/typeorm";
import User from "../app/Model/User";

class TestCase extends BaseTestCase {
  public createApplication() {
    return app.make<Kernel>("HttpKernel", { app }).start();
  }

  protected async setUp(): Promise<void> {
    await super.setUp();
    await DB.use(User).delete({});
  }
}

export default TestCase;
