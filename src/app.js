const express = require('express')
const morgan = require('morgan')
const usersRouter = require('@/modules/users/user.routes')
const { errorHandler } = require('@uniresp/server-express')
const { NotFoundError } = require('@uniresp/errors')

const app = express()

app.set('trust proxy', 1)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'api', status: 'healthy' })
})

app.use('/api/users', usersRouter)

app.use((_req, _res, next) => next(new NotFoundError('Route not found')))
app.use(errorHandler)

module.exports = app
