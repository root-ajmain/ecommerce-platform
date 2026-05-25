import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "4000", 10),
  apiUrl: process.env.API_URL ?? "http://localhost:4000",
  frontendUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001",
  encryptionKey: process.env.ENCRYPTION_KEY ?? "",
  cronSecret: process.env.CRON_SECRET ?? "",
}));
