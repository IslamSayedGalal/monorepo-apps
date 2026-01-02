import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: 'admin-panel-api',
  port: parseInt(process.env['ADMIN_API_PORT'] || '3001', 10),
  prefix: 'api/admin',
  cors: {
    origin: process.env['ADMIN_CORS_ORIGIN'] || 'http://localhost:4200',
    credentials: true,
  },
}));


