const Joi = require('joi');
const pick = require('../utils/pick');
const { fail } = require('@uniresp/core');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return res.status(400).json(fail('VALIDATION_ERROR', errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
