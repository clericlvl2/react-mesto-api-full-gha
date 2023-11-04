const cors = require('cors');

const ALLOWED_ORIGINS = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://127.0.0.1:3000',
  'https://127.0.0.1:3000',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = cors({
  credentials: true,
  maxAge: 3600,
  methods: DEFAULT_ALLOWED_METHODS,
  origin: ALLOWED_ORIGINS,
});
