import { Express, Response } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { logger } from "./logger.util";

const swaggerSpec = YAML.load("./swagger.yaml");

const swaggerDocs = (app: Express, PORT: string) => {
  // Swagger UI
  app.use("/explorer", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Docs JSON
  app.get("/swagger.json", (_, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Swagger UI is running on PORT ${PORT}/explorer`);
};

export default swaggerDocs;
