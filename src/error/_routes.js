const router = require('express').Router()
const express = require('express')
const fs = require('fs');
const { NotFoundError, UnauthorizedError, ValidationError, SystemError } = require('@uniresp/errors');


// ==== SYNC ERROR (throw) ====
router.get('/test/sync-throw', (req, res, next) => {
  throw new SystemError('SYNC_THROW');
});

// ==== ASYNC ERROR (promise reject) ====
const asyncH = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.get('/test/async-throw', asyncH(async (req, res) => {
  await new Promise((_, rej) => setTimeout(() => rej(new SystemError('ASYNC_THROW')), 10));
}));

// ==== CUSTOM STATUS + CODE + isOperational ====
router.get('/test/operational', (req, res, next) => {
  const error = new ValidationError('User input invalid');
  error.details = { field: 'email', reason: 'invalid-format' };
  next(error);
});

// ==== 404 qua error chain ====
router.get('/test/not-found', (req, res, next) => {
  next(new NotFoundError('Resource not found', {
    path: '/some/missing'
  }));
});

// ==== UNAUTHORIZED ====
router.get('/test/unauthorized', (req, res, next) => {
  next(new UnauthorizedError('Authentication required', {
    reason: 'Missing or invalid token'
  }));
});

// ==== FORBIDDEN ====
router.get('/test/forbidden', (req, res, next) => {
  const err = new SystemError('Forbidden');
  err.status = 403;
  err.code = 'AUTH.FORBIDDEN';
  err.isOperational = true;
  next(err);
});

// ==== CONFLICT (ví dụ trùng key DB) ====
router.get('/test/conflict', (req, res, next) => {
  const err = new SystemError('Duplicate key');
  err.status = 409;
  err.code = 'DB.DUPLICATE_KEY';
  err.details = { index: 'users_email_unique' };
  err.isOperational = true;
  next(err);
});

// ==== PAYLOAD JSON MALFORMED (body-parser) ====
// Gửi lên Content-Type: application/json với body sai cú pháp để test
router.get('/test/malformed', (req, res) => {
  res.json({ ok: true });
});

// ==== HEADERS SENT (không nên, để thấy handler không gửi tiếp được) ====
router.get('/test/headers-sent', (req, res) => {
  res.json({ ok: true, note: 'We send something first' });
  setTimeout(() => {
    console.error('AFTER_SEND_ERROR'); // chỉ log
  }, 10);
});


// ==== TIMEOUT (mô phỏng) ====
router.get('/test/timeout', (req, res, next) => {
  setTimeout(() => next(new SystemError('TIMEOUT_SIMULATED')), 3000);
});

// ==== STREAM ERROR (ví dụ đọc file không tồn tại) ====
router.get('/test/stream-error', (req, res, next) => {
  const s = fs.createReadStream('___missing_file___');
  s.on('error', next);
  s.pipe(res);
});

// ==== ZOD/JOI Validation (ví dụ tối giản) ====
router.post('/test/validation', express.json(), (req, res, next) => {
  const { email } = req.body || {};
  const isEmail = typeof email === 'string' && email.includes('@');
  if (!isEmail) {
    const err = new SystemError('Email invalid');
    err.status = 422;
    err.code = 'VALIDATION.EMAIL';
    err.isOperational = true;
    err.details = { email };
    return next(err);
  }
  res.json({ ok: true });
});

// ==== GENERIC UNKNOWN ====
router.get('/test/unknown', (req, res, next) => {
  const err = new SystemError('Something weird happened');
  // Không set status/code/isOperational -> sẽ map về 500 + SYS.UNKNOWN
  next(err);
});

module.exports = router
