import { Route } from "@lunoxjs/core/facades";
import DocsController from "../app/Http/Controllers/DocsController";

Route.get("/api-docs", [DocsController, "showDocs"]);
