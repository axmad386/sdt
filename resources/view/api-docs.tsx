import SwaggerUi from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
export default function() {
  return <SwaggerUi url="https://petstore.swagger.io/v2/swagger.json" />;
}
