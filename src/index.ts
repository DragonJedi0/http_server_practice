import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc, middlewarePrintMetrics, middlewareReset } from "./api/middleware.js";

// Create express app object
const app = express();
const PORT = 8080;

// Global log
app.use(middlewareLogResponses);
// Static app
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// Run app on PORT
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Register handlers
app.get("/api/healthz", handlerReadiness);

// Register middleware handlers
app.get("/api/metrics", middlewarePrintMetrics);
app.get("/api/reset", middlewareReset);