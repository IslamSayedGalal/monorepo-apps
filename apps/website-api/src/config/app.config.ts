import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: 'website-api',
  port: parseInt(process.env['WEBSITE_API_PORT'] || '3002', 10),
  prefix: 'api/website',
  cors: {
    origin: process.env['WEBSITE_CORS_ORIGIN'] || '*',
    credentials: true,
  },
}));
