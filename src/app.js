import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

import helmet from "helmet";
import rateLimit from "express-rate-limit";

app.use(helmet());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 80
});
app.use(limiter);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});
app.use(cors());
app.set("trust proxy", 1);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import errorHandler from "./middlewares/error.js";
app.use(errorHandler);


export default app;