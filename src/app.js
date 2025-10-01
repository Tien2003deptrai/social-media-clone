const express = require('express')
const morgan = require('morgan')
const usersRouter = require('@/modules/users/user.routes')
const { errorHandler } = require('@uniresp/server-express')
const { NotFoundError } = require('@uniresp/errors')
const { ok } = require('@uniresp/core')
const { connect } = require('@/core/config/db')
const { SystemError } = require('@uniresp/errors');
const cors = require('cors');

const routes = require('@/routes')

const app = express()

app.set('trust proxy', 1)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_TEST],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
}))

app.use('/api', routes)

app.get('/api/health', (req, res) => {
  res.json(ok('health', { message: "service" }))
})

app.get('/api/boom', () => { throw new SystemError('Boom'); });

connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use((req, _res, next) => {
  next(new NotFoundError('Route not found', { path: req.originalUrl }));
});

app.use(
  errorHandler({
    onLog: (err, req) => {
      console.error('[LOG]', { msg: err.message, path: req.path });
    },
    traceId: req => req.headers['x-request-id'],
  })
);
module.exports = app
