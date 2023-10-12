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
  CRON_TASK_CASHBACK: string
  CRON_TASK_AUTOMATIC_PAYMENTS: string
  CRON_TASK_EMAIL_ENABLED: boolean
  CRON_TASK_MEASURES_ENABLED: boolean
  CRON_TASK_CONTRACTS_STATUS_ENABLED: boolean
  CRON_TASK_CASHBACK_ENABLED: boolean
  CRON_TASK_AUTOMATIC_PAYMENTS_ENABLED: boolean
  EMAIL_FROM: string
  EMAIL_REPLY_TO: string
  EMAIL_CLIENT_TO_USE: 'ETHEREAL' | 'MAILJET'
  EMAIL_MAILJET_API_KEY: string
  EMAIL_MAILJET_API_SECRET: string
  EMAIL_MAILJET_ADDRESS_TO_FAKE: string
  EMAIL_ETHEREAL_KEY: string
  EMAIL_ETHEREAL_SECRET: string
  URL_FRONTEND: string
  WEB3_NETWORK_ID: number
  WEB3_NODE_PROVIDER_URL: string
  WEB3_NODE_PROVIDER_KEY: string
  WEB3_OWNER_SK: string
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
    CRON_TASK_CASHBACK: Env.schema.string(),
    CRON_TASK_AUTOMATIC_PAYMENTS: Env.schema.string(),
    CRON_TASK_EMAIL_ENABLED: Env.schema.boolean(),
    CRON_TASK_MEASURES_ENABLED: Env.schema.boolean(),
    CRON_TASK_CONTRACTS_STATUS_ENABLED: Env.schema.boolean(),
    CRON_TASK_CASHBACK_ENABLED: Env.schema.boolean(),
    CRON_TASK_AUTOMATIC_PAYMENTS_ENABLED: Env.schema.boolean(),
    EMAIL_FROM: Env.schema.string(),
    EMAIL_REPLY_TO: Env.schema.string(),
    EMAIL_CLIENT_TO_USE: Env.schema.enum(['ETHEREAL', 'MAILJET'] as const),
    EMAIL_MAILJET_API_KEY: Env.schema.string(),
    EMAIL_MAILJET_API_SECRET: Env.schema.string(),
    EMAIL_MAILJET_ADDRESS_TO_FAKE: Env.schema.string(),
    EMAIL_ETHEREAL_KEY: Env.schema.string(),
    EMAIL_ETHEREAL_SECRET: Env.schema.string(),
    URL_FRONTEND: Env.schema.string(),
    WEB3_NETWORK_ID: Env.schema.number(),
    WEB3_NODE_PROVIDER_URL: Env.schema.string(),
    WEB3_NODE_PROVIDER_KEY: Env.schema.string(),
    WEB3_OWNER_SK: Env.schema.string()
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
    CRON_TASK_CASHBACK: Env.schema.string(),
    CRON_TASK_AUTOMATIC_PAYMENTS: Env.schema.string(),
    CRON_TASK_EMAIL_ENABLED: Env.schema.boolean() || false,
    CRON_TASK_MEASURES_ENABLED: Env.schema.boolean() || false,
    CRON_TASK_CONTRACTS_STATUS_ENABLED: Env.schema.boolean() || false,
    CRON_TASK_CASHBACK_ENABLED: Env.schema.boolean() || false,
    CRON_TASK_AUTOMATIC_PAYMENTS_ENABLED: Env.schema.boolean() || false,
    EMAIL_FROM: Env.schema.string(),
    EMAIL_REPLY_TO: Env.schema.string(),
    EMAIL_CLIENT_TO_USE: Env.schema.enum(['ETHEREAL', 'MAILJET'] as const),
    EMAIL_MAILJET_API_KEY: Env.schema.string(),
    EMAIL_MAILJET_API_SECRET: Env.schema.string(),
    EMAIL_MAILJET_ADDRESS_TO_FAKE: Env.schema.string(),
    EMAIL_ETHEREAL_KEY: Env.schema.string(),
    EMAIL_ETHEREAL_SECRET: Env.schema.string(),
    URL_FRONTEND: Env.schema.string(),
    WEB3_NETWORK_ID: Env.schema.number(),
    WEB3_NODE_PROVIDER_URL: Env.schema.string(),
    WEB3_NODE_PROVIDER_KEY: Env.schema.string(),
    WEB3_OWNER_SK: Env.schema.string()
  })
}

export default rules
