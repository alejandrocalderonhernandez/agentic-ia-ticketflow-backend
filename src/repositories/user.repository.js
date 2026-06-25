const db = require('../db/database');

const findByCredentials = (email, password) =>
  db.prepare('SELECT id, name, lastname, email, phone FROM users WHERE email = ? AND password = ?').get(email, password);

const findById = (id) =>
  db.prepare('SELECT id, name, lastname, email, phone FROM users WHERE id = ?').get(id);

module.exports = { findByCredentials, findById };
