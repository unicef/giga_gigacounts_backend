import Env from '@ioc:Adonis/Core/Env'

interface EnvInterface {
  HOST: string
  PORT: number
  APP_KEY: string
  APP_NAME: string
  DRIVE_DISK: 'local'
  NODE_ENV: 'dev' | 'production' | 'test' | 'uat'
  AZURE_STORAGE_CONNECTION_STRING?: string
  AZURE_CONTAINER_NAME?: string
  ORIGINS_ALLOWED?: string
  TZ: 'UTC' | 'America/Sao_Paulo'
}

let rules: EnvInterface

if (process.env.production) {
  rules = Env.rules({
    HOST: Env.schema.string({ format: 'host' }),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    APP_NAME: Env.schema.string(),
    DRIVE_DISK: Env.schema.enum(['local'] as const),
    NODE_ENV: Env.schema.enum(['dev', 'production', 'test', 'uat'] as const),
    AZURE_STORAGE_CONNECTION_STRING: Env.schema.string(),
    AZURE_CONTAINER_NAME: Env.schema.string(),
    ORIGINS_ALLOWED: Env.schema.string(),
    TZ: Env.schema.enum(['UTC', 'America/Sao_Paulo'] as const),
  })
} else {
  rules = Env.rules({
    HOST: Env.schema.string({ format: 'host' }),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    APP_NAME: Env.schema.string(),
    DRIVE_DISK: Env.schema.enum(['local'] as const),
    NODE_ENV: Env.schema.enum(['dev', 'production', 'test', 'uat'] as const),
    TZ: Env.schema.enum(['UTC', 'America/Sao_Paulo'] as const),
  })
}

export default rules
