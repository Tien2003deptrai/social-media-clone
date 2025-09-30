const { ok } = require('@uniresp/core')
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ ok: true, module: 'users' })
})

router.get('/package/ok', (req, res) => {
  res.json(ok('Tien 21 age', { message: 'Lấy dữ liệu thành công' }))
})

module.exports = router


