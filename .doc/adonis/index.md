# Adonis

## Scheduler

If you want to run adonis scheduler with the http-server, just update __server.ts__ with this code:

```js
import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'
import { spawn } from 'child_process'

sourceMapSupport.install({ handleUncaughtExceptions: false })

new Ignitor(__dirname)
  .httpServer()
  .start()
  .then(() => {
    const schedulerProcess = spawn('node', ['ace', 'scheduler:run'], {
      stdio: 'inherit'
    })
    schedulerProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error('Error running scheduler')
      }
    })
  })
  .catch(console.error)
```