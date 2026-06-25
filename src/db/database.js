const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const schemaPath = path.join(__dirname, '../../sql/schema.sql');
const seedPath = path.join(__dirname, '../../sql/seed.sql');

if (!fs.existsSync(schemaPath)) {
  throw new Error(`schema.sql not found at: ${schemaPath}`);
}
if (!fs.existsSync(seedPath)) {
  throw new Error(`seed.sql not found at: ${seedPath}`);
}

const db = new Database(':memory:');

db.exec(fs.readFileSync(schemaPath, 'utf8'));
db.exec(fs.readFileSync(seedPath, 'utf8'));

console.log('Database initialized: schema and seed loaded successfully');

module.exports = db;
