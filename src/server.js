require('dotenv').config()
require('module-alias/register')
const app = require('@/app')

const PORT = Number(process.env.PORT) || 8080
let server

function start() {
  server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
  })

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is in use.`)
    } else {
      console.error('Server error:', err)
    }
    process.exit(1)
  })
}

function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down...`)
  if (!server) return process.exit(0)
  server.close(() => {
    console.log('HTTP server closed.')
    process.exit(0)
  })
  setTimeout(() => {
    console.warn('Force exiting after timeout.')
    process.exit(1)
  }, 10000).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

start()
