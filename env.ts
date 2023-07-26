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
  DB_DEBUG?: boolean
  ORIGINS_ALLOWED?: string
  TZ: 'UTC' | 'America/Sao_Paulo'
  CRON_TASK_EMAIL: string
  CRON_TASK_MEASURES: string
  CRON_TASK_CONTRACTS_STATUS: string
  EMAIL_FROM: string
  EMAIL_CLIENT_TO_USE: 'ETHEREAL' | 'MAILJET'
  EMAIL_MAILJET_API_KEY: string
  EMAIL_MAILJET_API_SECRET: string
  EMAIL_MAILJET_ADDRESS_TO_FAKE: string
  EMAIL_ETHEREAL_KEY: string
  EMAIL_ETHEREAL_SECRET: string
  JWT_PRIVATE_KEY: string
  JWT_PUBLIC_KEY: string
  URL_FRONTEND: string
}

let rules: EnvInterface

const NODE_ENV = process.env.NODE_ENV || ''

if (NODE_ENV === 'production') {
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
    CRON_TASK_EMAIL: Env.schema.string(),
    CRON_TASK_MEASURES: Env.schema.string(),
    CRON_TASK_CONTRACTS_STATUS: Env.schema.string(),
    EMAIL_FROM: Env.schema.string(),
    EMAIL_CLIENT_TO_USE: Env.schema.enum(['ETHEREAL', 'MAILJET'] as const),
    EMAIL_MAILJET_API_KEY: Env.schema.string(),
    EMAIL_MAILJET_API_SECRET: Env.schema.string(),
    EMAIL_MAILJET_ADDRESS_TO_FAKE: Env.schema.string(),
    EMAIL_ETHEREAL_KEY: Env.schema.string(),
    EMAIL_ETHEREAL_SECRET: Env.schema.string(),
    JWT_PRIVATE_KEY: Env.schema.string(),
    JWT_PUBLIC_KEY: Env.schema.string(),
    URL_FRONTEND: Env.schema.string()
  })
} else {
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
    DB_DEBUG: Env.schema.boolean(),
    TZ: Env.schema.enum(['UTC', 'America/Sao_Paulo'] as const),
    CRON_TASK_EMAIL: Env.schema.string(),
    CRON_TASK_MEASURES: Env.schema.string(),
    CRON_TASK_CONTRACTS_STATUS: Env.schema.string(),
    EMAIL_FROM: Env.schema.string(),
    EMAIL_CLIENT_TO_USE: Env.schema.enum(['ETHEREAL', 'MAILJET'] as const),
    EMAIL_MAILJET_API_KEY: Env.schema.string(),
    EMAIL_MAILJET_API_SECRET: Env.schema.string(),
    EMAIL_MAILJET_ADDRESS_TO_FAKE: Env.schema.string(),
    EMAIL_ETHEREAL_KEY: Env.schema.string(),
    EMAIL_ETHEREAL_SECRET: Env.schema.string(),
    JWT_PRIVATE_KEY: Env.schema.string(),
    JWT_PUBLIC_KEY: Env.schema.string(),
    URL_FRONTEND: Env.schema.string()
  })
}

export default rules
