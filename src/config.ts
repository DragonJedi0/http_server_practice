import type { MigrationConfig } from "drizzle-orm/migrator";

type DBConfig = {
    migrationConfig: MigrationConfig;
    url: string;
}

type APIConfig = {
    fileServerHits: number;
    port: number;
    platform: string;
};

type JWTConfig = {
    defaultDuration: number;
    secret: string;
    issuer: string;
}

type Config = {
    api: APIConfig;
    db: DBConfig;
    jwt: JWTConfig;
}

process.loadEnvFile();

const migrationConfig: MigrationConfig = {
    migrationsFolder: "src/lib/db/migrations",
};

export const config: Config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM")
    },
    db: {
        migrationConfig: migrationConfig,
        url: envOrThrow("DB_URL"),
    },
    jwt: {
        defaultDuration: 60 * 60, // 1 hour in seconds
        secret: envOrThrow("SECRET"),
        issuer: "chirpy",
    }
}

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}