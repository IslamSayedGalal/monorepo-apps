import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: 'mobile-api',
  port: parseInt(process.env['MOBILE_API_PORT'] || '3003', 10),
  prefix: 'api/mobile',
  cors: {
    origin: '*',
    credentials: true,
  },
}));
