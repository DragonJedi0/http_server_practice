process.loadEnvFile();

type APIConfig = {
    fileServerHits: number,
    dbURL: string,
};

export const config: APIConfig = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL"),
}

function envOrThrow(key: string){
    if(!process.env[key]){
        throw new Error("DB_URL not set");
    }
    return process.env[key];
}