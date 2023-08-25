import { hooks } from '@adonisjs/ignitor'
import rules from '../env'

hooks.before.httpServer(() => {
  const requiredEnvVariables = Object.keys(rules)

  for (const envVar of requiredEnvVariables) {
    if (!process.env[envVar]) {
      console.error(
        `Error: Missing required environment variable: ${envVar}. Review example_env file to check all required variables or contact to devOps Team.`
      )
      process.exit(1)
    }
  }
})
