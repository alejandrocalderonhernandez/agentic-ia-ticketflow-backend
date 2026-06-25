const crypto = require('crypto');

const tokenStore = new Map();

const generate = (userId) => {
  const token = `tok_${crypto.randomUUID()}`;
  tokenStore.set(token, userId);
  return token;
};

const validate = (token) => tokenStore.get(token) ?? null;

const revoke = (token) => tokenStore.delete(token);

module.exports = { generate, validate, revoke };
