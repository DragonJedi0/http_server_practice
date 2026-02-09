import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc, middlewarePrintMetrics, middlewareReset } from "./api/middleware.js";
import { handlerValidateChirp } from "./api/validate_chirp.js";
import { errorHandler } from "./api/errors.js";

// Create express app object
const app = express();
const PORT = 8080;

// Global log
app.use(middlewareLogResponses);
app.use(express.json());
// Static app
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// Register handlers
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", (req, res, next) => {
    Promise.resolve(handlerValidateChirp(req, res)).catch(next);
});

// Register admin middleware handlers
app.get("/admin/metrics", middlewarePrintMetrics);
app.post("/admin/reset", middlewareReset);

// Set Error Handler
app.use(errorHandler);

// Run app on PORT
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});