import SwaggerUi from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import spec from "../../docs/swagger.json";
export default function () {
  return <SwaggerUi spec={spec} />;
}
