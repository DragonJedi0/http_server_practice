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

type Config = {
    api: APIConfig;
    db: DBConfig;
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
    }
}

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}