import { type ConfigType, registerAs } from '@nestjs/config';

import { envSchema } from './env.schema';

export const appConfig = registerAs('app', () => {
  const env = envSchema.parse(process.env);

  return {
    name: env.APP_NAME,
    version: env.APP_VERSION,
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    apiPrefix: sanitizeApiPrefix(env.API_PREFIX),
    corsOrigin: parseCorsOrigin(env.CORS_ORIGIN),
  };
});

export type AppConfig = ConfigType<typeof appConfig>;

function sanitizeApiPrefix(prefix: string): string {
  return prefix.replace(/^\/+|\/+$/g, '');
}

function parseCorsOrigin(corsOrigin: string): true | string[] {
  if (corsOrigin === '*') {
    return true;
  }

  return corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export default appConfig;
