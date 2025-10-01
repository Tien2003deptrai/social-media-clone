const mongoose = require('mongoose');

let conn;

async function connect() {
  if (!conn) {
    const mongoUri = process.env.MONGODB_URI;
    conn = mongoose.connect(mongoUri);
  }

  return conn;
}

module.exports = { connect };
