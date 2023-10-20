import SwaggerUi from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
export default function({ spec }: { spec: string }) {
  return <SwaggerUi spec={spec} />;
}
