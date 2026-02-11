import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerGetAllChirps, handlerGetChirpByID, handlerPostChirp } from "./api/chirp.js";
import { errorHandler } from "./api/errors.js";
import { config } from "./config.js";
import { middlewareReset } from "./api/reset.js";
import { middlewarePrintMetrics } from "./api/metrics.js";
import { handlerCreateUser } from "./api/users.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// Create express app object
const app = express();

// Global log
app.use(middlewareLogResponses);
app.use(express.json());
// Static app
app.use("/app", middlewareMetricsInc, express.static("./src/app"));


// Register handlers
app.get("/api/healthz", handlerReadiness);

  // Chirps handlers
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerPostChirp(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerGetChirpByID(req, res)).catch(next);
});

  // User handlers
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
})


// Register admin middleware handlers
app.get("/admin/metrics", middlewarePrintMetrics);
app.post("/admin/reset", middlewareReset);

// Set Error Handler
app.use(errorHandler);

// Run app on PORT
app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});