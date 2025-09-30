const express = require('express')
const usersRouter = require('@/modules/users/user.routes')

const app = express()

app.use(express.json())
app.use('/users', usersRouter)

module.exports = app


