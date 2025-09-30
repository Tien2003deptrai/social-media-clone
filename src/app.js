const express = require('express')
const morgan = require('morgan')
const usersRouter = require('@/modules/users/user.routes')
const { errorHandler } = require('@uniresp/server-express')
const { NotFoundError } = require('@uniresp/errors')
const { ok } = require('@uniresp/core')
const { connect } = require('@/core/config/db')

const app = express()

app.set('trust proxy', 1)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json(ok('health', { message: "service" }))
})

connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', usersRouter)

app.use(
  errorHandler({
    onLog: (err, req) => {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] ERROR:`, {
        message: err.message,
        code: err.code || 'UNKNOWN',
        status: err.status || 500,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    },
    traceId: req => (req.headers['x-request-id']),
  })
);

app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    error: {
      code: 'ROUTE.NOT_FOUND',
      message: 'Route not found',
      details: { path: _req.originalUrl },
    },
  });
});

module.exports = app
