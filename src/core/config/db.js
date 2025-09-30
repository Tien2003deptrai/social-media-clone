const mongoose = require('mongoose');

let conn;

async function connect() {
  if (!conn) conn = mongoose.connect('mongodb://localhost:27017/social-media');

  return conn;
}

module.exports = { connect };
