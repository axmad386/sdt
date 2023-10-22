import { Controller } from "@lunoxjs/core";
import fs from "fs";
class DocsController extends Controller {
  async showDocs() {
    const json = fs.readFileSync(root_path("docs/swagger.json"), "utf8");
    return view("api-docs", { spec: JSON.parse(json) }).clientSideOnly();
  }
}

export default DocsController;
