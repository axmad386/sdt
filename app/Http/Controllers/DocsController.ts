import { Controller } from "@lunoxjs/core";

class DocsController extends Controller {
  async showDocs() {
    const spec = await import("../../../docs/swagger.json");
    return view("api-docs", { spec }).clientSideOnly();
  }
}

export default DocsController;
