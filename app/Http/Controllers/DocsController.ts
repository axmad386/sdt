import { Controller, Request } from "@lunoxjs/core";

class DocsController extends Controller {
  async showDocs() {
    return view("api-docs").clientSideOnly();
  }
}

export default DocsController;
