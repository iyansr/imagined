import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: String(process.env.DATABASE_URL_PROD),
  },
  verbose: true,
  strict: true,
});
