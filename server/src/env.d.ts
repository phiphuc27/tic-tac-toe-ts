declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
  }
}
